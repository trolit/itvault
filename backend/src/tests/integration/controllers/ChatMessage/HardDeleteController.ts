import { expect } from "chai";
import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import {
  USER_EMAIL,
  SUPER_USER_EMAIL,
  UNEXISTING_ITEM_ID,
} from "@integration-tests/config";

import { CHAT_MESSAGE_1 } from "./GetAllController";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };

export const CHAT_MESSAGE_TO_DELETE = {
  id: 3,
  email: SUPER_USER_EMAIL,
};

export const USER_CHAT_MESSAGE = {
  id: 4,
  email: USER_EMAIL,
};

export const HARD_DELETE_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.DELETE,
    baseQuery,
  },

  ({ addTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery,
      appendToAction: `${CHAT_MESSAGE_TO_DELETE.id}`,
    });

    addTest({
      description: `returns ${HTTP.NO_CONTENT} when chat message does not exist`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction: `${UNEXISTING_ITEM_ID}`,
      expect: {
        statusCode: HTTP.NO_CONTENT,
      },
    });

    addTest({
      description: `returns ${HTTP.FORBIDDEN} when trying to remove message of different user`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction: `${USER_CHAT_MESSAGE.id}`,
      expect: {
        statusCode: HTTP.FORBIDDEN,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when trying to remove message with replies`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction: `${CHAT_MESSAGE_1.id}`,
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.NO_CONTENT} when chat message is deleted`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction: `${CHAT_MESSAGE_TO_DELETE.id}`,
      expect: {
        statusCode: HTTP.NO_CONTENT,
        callback: async () => {
          const chatMessageRepository = getInstanceOf<IChatMessageRepository>(
            Di.ChatMessageRepository
          );

          const chatMessage = await chatMessageRepository.getById(
            CHAT_MESSAGE_TO_DELETE.id
          );

          expect(chatMessage).to.equal(null);
        },
      },
    });
  }
);
