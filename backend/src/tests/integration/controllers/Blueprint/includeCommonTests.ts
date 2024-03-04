import { ITest } from "@integration-tests/probata";
import { StatusCodes as HTTP } from "http-status-codes";
import {
  MEMBER_EMAIL,
  HEAD_ADMIN_EMAIL,
  UNEXISTING_WORKSPACE_ID,
} from "@integration-tests/config";

export const includeCommonTests = (arg: {
  baseQuery: any;
  addTest: <Q, B>(data: Omit<ITest<Q, B>, "method">) => void;
  blueprintId?: number;
}) => {
  const { addTest, baseQuery, blueprintId } = arg;
  const appendToAction = blueprintId ? `${blueprintId}` : undefined;

  addTest({
    description: `returns ${HTTP.UNAUTHORIZED} when user is not signed in`,
    appendToAction,
    expect: {
      statusCode: HTTP.UNAUTHORIZED,
    },
  });

  addTest({
    description: `returns ${HTTP.FORBIDDEN} when 'workspaceId' query param is not provided`,
    session: { user: { email: MEMBER_EMAIL } },
    appendToAction,
    expect: {
      statusCode: HTTP.FORBIDDEN,
    },
  });

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when workspace does not exist`,
    session: { user: { email: HEAD_ADMIN_EMAIL } },
    appendToAction,
    query: {
      ...baseQuery,
      workspaceId: UNEXISTING_WORKSPACE_ID,
    },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  addTest({
    description: `returns ${HTTP.FORBIDDEN} when user is not permitted to access workspace related endpoint`,
    query: baseQuery,
    session: { user: { email: MEMBER_EMAIL } },
    appendToAction,
    expect: {
      statusCode: HTTP.FORBIDDEN,
    },
  });
};
