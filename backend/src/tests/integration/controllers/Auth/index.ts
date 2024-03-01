import { defineTestsGroup } from "@integration-tests/probata";
import { addUsers } from "@integration-tests/helpers/user-helpers";

import { MEMBER_ROLE } from "@config/initial-roles";

import { GET_SESSIONS_CONTROLLER_V1_TESTS } from "./GetSessionsController";
import { STATUS_CONTROLLER_V1_TESTS, STATUS_MEMBER } from "./StatusController";
import {
  SIGN_OUT_CONTROLLER_V1_TESTS,
  SIGN_OUT_MEMBER_EMAIL,
} from "./SignOutController";
import {
  SESSION_LIMIT_EMAIL,
  VALID_REQUEST_EMAIL,
  NOT_SIGNED_UP_TEST_EMAIL,
  SIGN_IN_CONTROLLER_V1_TESTS,
} from "./SignInController";
import {
  DELETE_SESSION_CONTROLLER_V1_TESTS,
  DELETE_SESSION_MEMBER1_EMAIL,
  DELETE_SESSION_MEMBER2_EMAIL,
} from "./DeleteSessionController";

import { BaseController } from "@controllers/BaseController";
import { StatusController } from "@controllers/Auth/StatusController";
import { SignInController } from "@controllers/Auth/SignInController";
import { SignOutController } from "@controllers/Auth/SignOutController";
import { GetSessionsController } from "@controllers/Auth/GetSessionsController";
import { DeleteSessionController } from "@controllers/Auth/DeleteSessionController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const AUTH_TESTS = defineTestsGroup({
  name: "Auth",
  router: `auth`,
  before: () => {
    return addUsers([
      {
        email: VALID_REQUEST_EMAIL,
        isSignedUp: true,
        roleNameOrId: MEMBER_ROLE.name,
      },
      {
        email: NOT_SIGNED_UP_TEST_EMAIL,
        isSignedUp: false,
        roleNameOrId: MEMBER_ROLE.name,
      },
      {
        email: SESSION_LIMIT_EMAIL,
        isSignedUp: true,
        roleNameOrId: MEMBER_ROLE.name,
      },
      {
        email: DELETE_SESSION_MEMBER1_EMAIL,
        isSignedUp: true,
        roleNameOrId: MEMBER_ROLE.name,
      },
      {
        email: DELETE_SESSION_MEMBER2_EMAIL,
        isSignedUp: true,
        roleNameOrId: MEMBER_ROLE.name,
      },
      {
        email: SIGN_OUT_MEMBER_EMAIL,
        isSignedUp: true,
        roleNameOrId: MEMBER_ROLE.name,
      },
      {
        email: STATUS_MEMBER,
        isSignedUp: true,
        roleNameOrId: MEMBER_ROLE.name,
      },
    ]);
  },
  collection: [
    {
      action: "sign-in",
      controller: SignInController.name,
      testData: [
        {
          routerVersion: v1,
          tests: SIGN_IN_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "sign-out",
      controller: SignOutController.name,
      testData: [
        {
          routerVersion: v1,
          tests: SIGN_OUT_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "sessions",
      controller: GetSessionsController.name,
      testData: [
        {
          routerVersion: v1,
          tests: GET_SESSIONS_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "sessions",
      controller: DeleteSessionController.name,
      testData: [
        {
          routerVersion: v1,
          tests: DELETE_SESSION_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "status",
      controller: StatusController.name,
      testData: [
        {
          routerVersion: v1,
          tests: STATUS_CONTROLLER_V1_TESTS,
        },
      ],
    },
  ],
});
