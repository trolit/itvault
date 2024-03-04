import { defineTestsGroup } from "@integration-tests/probata";

import { ADD_CONTROLLER_V1_TESTS } from "./AddController";
import { GET_ALL_CONTROLLER_V1_TESTS } from "./GetAllController";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/Blueprint/AddController";
import { GetAllController } from "@controllers/Blueprint/GetAllController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const BLUEPRINT_TESTS = defineTestsGroup({
  name: "Blueprint",
  router: `blueprints`,
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
      controller: AddController.name,
      testData: [
        {
          routerVersion: v1,
          tests: ADD_CONTROLLER_V1_TESTS,
        },
      ],
    },
  ],
});
