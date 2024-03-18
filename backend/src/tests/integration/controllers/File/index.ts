import { defineTestsGroup } from "@integration-tests/probata";

import { GET_ALL_CONTROLLER_V1_TESTS } from "./GetAllController";

import { BaseController } from "@controllers/BaseController";
import { GetAllController } from "@controllers/File/GetAllController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const FILE_TESTS = defineTestsGroup({
  name: "File",
  router: `files`,
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
  ],
});
