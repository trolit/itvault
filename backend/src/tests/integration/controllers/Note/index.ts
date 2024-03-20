import { defineTestsGroup } from "@integration-tests/probata";

import { GET_ALL_CONTROLLER_V1_TESTS } from "./GetAllController";
import {
  SOFT_DELETE_CONTROLLER_V1_TESTS,
  SOFT_DELETE_CONTROLLER_V1_BEFORE_HOOK,
} from "./SoftDeleteController";

import { BaseController } from "@controllers/BaseController";
import { GetAllController } from "@controllers/Note/GetAllController";
import { SoftDeleteController } from "@controllers/Note/SoftDeleteController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const NOTE_TESTS = defineTestsGroup({
  name: "Note",
  router: `notes`,
  collection: [
    {
      action: "",
      controller: GetAllController.name,
      testData: [
        {
          routerVersion: v1,
          tests: GET_ALL_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "",
      controller: SoftDeleteController.name,
      testData: [
        {
          routerVersion: v1,
          tests: SOFT_DELETE_CONTROLLER_V1_TESTS,
        },
      ],
    },
  ],
  hooks: {
    before: function () {
      return Promise.all([SOFT_DELETE_CONTROLLER_V1_BEFORE_HOOK()]);
    },
  },
});
