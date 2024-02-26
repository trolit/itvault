import { addUsers } from "tests/integration/helpers/user-helpers";
import { defineTestsContainer } from "tests/integration/helpers/defineTestsContainer";

import { MEMBER_ROLE } from "@config/initial-roles";

import { SIGN_IN_CONTROLLER_V1_TESTS } from "./SignInController";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const SESSION_TEST_EMAIL = "session@email.com";
export const NOT_SIGNED_UP_TEST_EMAIL = "not-signed-up@email.com";

export const AUTH_TESTS = defineTestsContainer({
  name: "Auth",
  route: `auth/sign-in`,
  before: () => {
    return addUsers([
      {
        email: SESSION_TEST_EMAIL,
        isSignedUp: true,
        roleNameOrId: MEMBER_ROLE.name,
      },
      {
        email: NOT_SIGNED_UP_TEST_EMAIL,
        isSignedUp: false,
        roleNameOrId: MEMBER_ROLE.name,
      },
    ]);
  },
  collection: [
    {
      controller: `SignInController`,
      testData: [
        {
          routerVersion: v1,
          tests: SIGN_IN_CONTROLLER_V1_TESTS,
        },
      ],
    },
  ],
});
