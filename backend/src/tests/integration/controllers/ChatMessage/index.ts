import { defineTestsGroup } from "@integration-tests/probata";
import { addChatMessages } from "@integration-tests/helpers/db/addChatMessages";

import {
  CHAT_MESSAGE_1,
  CHAT_MESSAGE_2,
  GET_ALL_CONTROLLER_V1_TESTS,
} from "./GetAllController";

import { BaseController } from "@controllers/BaseController";
import { GetAllController } from "@controllers/ChatMessage/GetAllController";

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
  ],
  hooks: {
    before: () => {
      return addChatMessages([CHAT_MESSAGE_1, CHAT_MESSAGE_2]);
    },
  },
});
