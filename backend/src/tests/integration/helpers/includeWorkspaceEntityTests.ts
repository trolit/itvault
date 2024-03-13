import { ITest } from "@integration-tests/probata";
import { USER_EMAIL } from "@integration-tests/config";
import { StatusCodes as HTTP } from "http-status-codes";

const defaultFlags = {
  workspaceIdNotProvidedTest: true,
  notPermittedToViewWorkspace: true,
};

export const includeWorkspaceEntityTests = (
  data: {
    baseQuery: any;
    appendToAction?: string;
    addTest: <Q, B>(data: Omit<ITest<Q, B>, "method">) => void;
  },
  flags?: {
    workspaceIdNotProvidedTest?: boolean;
    notPermittedToViewWorkspace?: boolean;
  }
) => {
  const { addTest, baseQuery, appendToAction } = data;

  const currentFlags = flags || defaultFlags;

  if (currentFlags.workspaceIdNotProvidedTest) {
    addTest({
      description: `returns ${HTTP.FORBIDDEN} when 'workspaceId' query param is not provided`,
      session: { user: { email: USER_EMAIL } },
      appendToAction,
      expect: {
        statusCode: HTTP.FORBIDDEN,
      },
    });
  }

  if (currentFlags.notPermittedToViewWorkspace) {
    addTest({
      description: `returns ${HTTP.FORBIDDEN} when user is not permitted to access workspace related endpoint`,
      query: baseQuery,
      session: { user: { email: USER_EMAIL } },
      appendToAction,
      expect: {
        statusCode: HTTP.FORBIDDEN,
      },
    });
  }
};
