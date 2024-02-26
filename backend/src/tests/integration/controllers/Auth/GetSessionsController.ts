import { Method } from "tests/integration/types/Method";
import { StatusCodes as HTTP } from "http-status-codes";
import { HEAD_ADMIN_EMAIL } from "tests/integration/common-data";
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

    addTest({
      description: `returns ${HTTP.OK} when user is signed in`,
      sendAs: HEAD_ADMIN_EMAIL,
      expect: {
        statusCode: HTTP.OK,
      },
    });
  }
);
