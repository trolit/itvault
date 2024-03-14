import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import {
  SUPER_USER_EMAIL,
  UNEXISTING_CHAT_MESSAGE_ID,
} from "@integration-tests/config";

import { includeTextTests } from "./includeTextTests";

import { WORKSPACE_CHAT_MAX_DEPTH } from "@shared/constants/config";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };

const STARTING_INDEX = 5;

export const DEPTH_MESSAGES = Array.from(
  { length: WORKSPACE_CHAT_MAX_DEPTH },
  (item, currentIndex) => {
    const id = STARTING_INDEX + currentIndex;

    return {
      id,
      replyToId: id === STARTING_INDEX ? undefined : id - 1,
    };
  }
);

const LAST_DEPTH_CHAT_MESSAGE_ID =
  STARTING_INDEX + WORKSPACE_CHAT_MAX_DEPTH - 1;
const PENUMILATE_DEPTH_CHAT_MESSAGE_ID =
  STARTING_INDEX + WORKSPACE_CHAT_MAX_DEPTH - 2;

export const ADD_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.POST,
    baseQuery,
  },

  ({ addTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery,
    });

    includeTextTests({
      addTest,
      baseQuery,
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when trying to reply to unexisting message`,
      session: { user: { email: SUPER_USER_EMAIL } },
      body: {
        text: "some typical text",
        replyToId: UNEXISTING_CHAT_MESSAGE_ID,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    if (LAST_DEPTH_CHAT_MESSAGE_ID) {
      addTest({
        description: `returns ${HTTP.BAD_REQUEST} when reaching out max depth (${WORKSPACE_CHAT_MAX_DEPTH}) of messages`,
        session: { user: { email: SUPER_USER_EMAIL } },
        body: {
          text: "some typical text",
          replyToId: LAST_DEPTH_CHAT_MESSAGE_ID,
        },
        expect: {
          statusCode: HTTP.BAD_REQUEST,
        },
      });
    }

    if (PENUMILATE_DEPTH_CHAT_MESSAGE_ID) {
      addTest({
        description: `returns ${
          HTTP.CREATED
        } when replying to available depth (${WORKSPACE_CHAT_MAX_DEPTH - 2})`,
        session: { user: { email: SUPER_USER_EMAIL } },
        body: {
          text: "some typical text",
          replyToId: PENUMILATE_DEPTH_CHAT_MESSAGE_ID,
        },
        expect: {
          statusCode: HTTP.CREATED,
        },
      });
    }
  }
);
