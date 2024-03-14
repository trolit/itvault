import { defineTestsGroup } from "@integration-tests/probata";
import { addChatMessages } from "@integration-tests/helpers/db/addChatMessages";

import { ADD_CONTROLLER_V1_TESTS, DEPTH_MESSAGES } from "./AddController";
import {
  CHAT_MESSAGE_TO_UPDATE,
  PATCH_VALUE_CONTROLLER_V1_TESTS,
} from "./PatchValueController";
import {
  CHAT_MESSAGE_1,
  CHAT_MESSAGE_2,
  GET_ALL_CONTROLLER_V1_TESTS,
} from "./GetAllController";
import {
  USER_CHAT_MESSAGE,
  CHAT_MESSAGE_TO_DELETE,
  HARD_DELETE_CONTROLLER_V1_TESTS,
} from "./HardDeleteController";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/ChatMessage/AddController";
import { GetAllController } from "@controllers/ChatMessage/GetAllController";
import { HardDeleteController } from "@controllers/ChatMessage/HardDeleteController";
import { PatchValueController } from "@controllers/ChatMessage/PatchValueController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const CHAT_MESSAGE_TESTS = defineTestsGroup({
  name: "ChatMessage",
  router: `chat-messages`,
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
      controller: HardDeleteController.name,
      testData: [
        {
          routerVersion: v1,
          tests: HARD_DELETE_CONTROLLER_V1_TESTS,
        },
      ],
    },
    {
      action: "",
      controller: PatchValueController.name,
      testData: [
        {
          routerVersion: v1,
          tests: PATCH_VALUE_CONTROLLER_V1_TESTS,
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
  hooks: {
    before: () => {
      return addChatMessages([
        CHAT_MESSAGE_1,
        CHAT_MESSAGE_2,
        CHAT_MESSAGE_TO_DELETE,
        USER_CHAT_MESSAGE,
        CHAT_MESSAGE_TO_UPDATE,
        ...DEPTH_MESSAGES,
      ]);
    },
  },
});
