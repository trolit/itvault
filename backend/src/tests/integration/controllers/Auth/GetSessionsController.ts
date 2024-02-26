import { StatusCodes as HTTP } from "http-status-codes";
import { Method } from "tests/integration/types/Method";
import { buildTests } from "tests/integration/helpers/buildTests";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const GET_SESSIONS_CONTROLLER_V1_TESTS = buildTests(
  { method: Method.GET, baseQuery: { version: v1 } },

  ({ addTest }) => {
    addTest({
      description: `returns ${HTTP.UNAUTHORIZED} when user is not signed in`,
      expect: {
        statusCode: HTTP.UNAUTHORIZED,
      },
    });
  }
);
