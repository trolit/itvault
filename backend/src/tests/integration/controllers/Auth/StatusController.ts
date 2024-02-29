import { StatusCodes as HTTP } from "http-status-codes";
import { Method } from "@integration-tests/types/Method";
import { IUserService } from "types/services/IUserService";
import { HEAD_ADMIN_EMAIL } from "@integration-tests/config";
import { buildTests } from "@integration-tests/helpers/buildTests";
import { IUserRepository } from "types/repositories/IUserRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const STATUS_MEMBER = "sign-out@email.com";

export const STATUS_CONTROLLER_V1_TESTS = buildTests(
  {
    method: Method.GET,
    baseQuery: { version: v1 },
  },

  ({ addTest, addCustomTest }) => {
    addCustomTest({
      description: `returns ${HTTP.UNAUTHORIZED} when user is signed in but account was deactivated`,
      statusCode: HTTP.UNAUTHORIZED,
      runner: async ({ testAgent }) => {
        const userRepository = getInstanceOf<IUserRepository>(
          Di.UserRepository
        );
        const userService = getInstanceOf<IUserService>(Di.UserService);

        const user = await userRepository.findByEmail(STATUS_MEMBER);

        if (!user) {
          throw Error(
            `User ${STATUS_MEMBER} should be created in order to run this test!`
          );
        }

        const cookie = await testAgent.authenticate({
          email: STATUS_MEMBER,
        });

        await userService.updateMany([
          { id: user.id, data: { isActive: false } },
        ]);

        return testAgent.request({ session: { cookie } });
      },
    });

    addTest({
      description: `returns ${HTTP.OK} when user is signed in`,
      session: {
        user: { email: HEAD_ADMIN_EMAIL },
      },
      expect: {
        statusCode: HTTP.OK,
      },
    });
  }
);
