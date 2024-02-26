import { addUsers } from "tests/integration/helpers/user-helpers";
import { defineTestsContainer } from "tests/integration/helpers/defineTestsContainer";

import { MEMBER_ROLE } from "@config/initial-roles";

import { GET_SESSIONS_CONTROLLER_V1_TESTS } from "./GetSessionsController";
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
import { SignInController } from "@controllers/Auth/SignInController";
import { GetSessionsController } from "@controllers/Auth/GetSessionsController";
import { DeleteSessionController } from "@controllers/Auth/DeleteSessionController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const AUTH_TESTS = defineTestsContainer({
  name: "Auth",
  route: `auth`,
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
    ]);
  },
  collection: [
    {
      route: "sign-in",
      controller: SignInController.name,
      testData: [
        {
          routerVersion: v1,
          tests: SIGN_IN_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      route: "sessions",
      controller: GetSessionsController.name,
      testData: [
        {
          routerVersion: v1,
          tests: GET_SESSIONS_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      route: "sessions",
      controller: DeleteSessionController.name,
      testData: [
        {
          routerVersion: v1,
          tests: DELETE_SESSION_CONTROLLER_V1_TESTS,
        },
      ],
    },
  ],
});
