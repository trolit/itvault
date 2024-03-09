import { ITest } from "@integration-tests/probata";
import { StatusCodes as HTTP } from "http-status-codes";

import { USER_EMAIL } from "@shared/constants/tests";

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
    session: { user: { email: USER_EMAIL } },
    appendToAction,
    expect: {
      statusCode: HTTP.FORBIDDEN,
    },
  });

  addTest({
    description: `returns ${HTTP.FORBIDDEN} when user is not permitted to access workspace related endpoint`,
    query: baseQuery,
    session: { user: { email: USER_EMAIL } },
    appendToAction,
    expect: {
      statusCode: HTTP.FORBIDDEN,
    },
  });
};
