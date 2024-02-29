import { expect } from "chai";
import { StatusCodes as HTTP } from "http-status-codes";
import { Method } from "@integration-tests/types/Method";
import { IAuthService } from "types/services/IAuthService";
import { buildTests } from "@integration-tests/helpers/buildTests";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const SIGN_OUT_MEMBER_EMAIL = "sign-out@email.com";

export const SIGN_OUT_CONTROLLER_V1_TESTS = buildTests(
  {
    method: Method.POST,
    baseQuery: { version: v1 },
  },

  ({ addTest, addCustomTest }) => {
    addTest({
      description: `returns ${HTTP.UNAUTHORIZED} when user is not signed in`,
      expect: {
        statusCode: HTTP.UNAUTHORIZED,
      },
    });

    addCustomTest({
      description: `returns ${HTTP.OK} when user signs out of app`,
      statusCode: HTTP.OK,
      runner: async ({ testAgent }) => {
        const authService = getInstanceOf<IAuthService>(Di.AuthService);

        const cookie = await testAgent.authenticate({
          email: SIGN_OUT_MEMBER_EMAIL,
        });

        const jsonwebtoken = testAgent.extractTokenFromCookie({ cookie });

        const result = authService.verifyToken(jsonwebtoken);

        if (result.error) {
          throw Error("Invalid token!");
        }

        const response = await testAgent.request({ session: { cookie } });

        const {
          payload: { id, sessionId },
        } = result;

        const sessionStatus = await authService.isSessionActive(id, sessionId);

        expect(sessionStatus).to.equal(false);

        return response;
      },
    });
  }
);
