import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { AddControllerTypes } from "types/controllers/ChatMessage/AddController";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";

import { Di } from "@enums/Di";
import { CHAT_MESSAGE_RULES } from "@shared/constants/rules";
import { WORKSPACE_CHAT_MAX_DEPTH } from "@shared/constants/config";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useTextSchema } from "@schemas/common/useTextSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { MIN_LENGTH, MAX_LENGTH } = CHAT_MESSAGE_RULES.VALUE;

const bodySchema: SuperSchema.Fragment<AddControllerTypes.v1.Body> = object({
  text: useTextSchema(MIN_LENGTH, MAX_LENGTH),

  replyToId: number()
    .optional()
    .test(async (value: number | undefined, ctx) => {
      if (!value) {
        return true;
      }

      const chatMessageRepository = getInstanceOf<IChatMessageRepository>(
        Di.ChatMessageRepository
      );

      const message = await chatMessageRepository.getOne({
        where: {
          id: value,
        },
      });

      if (!message) {
        return ctx.createError({
          message: setYupError(
            CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE,
            "Message"
          ),
        });
      }

      if (!WORKSPACE_CHAT_MAX_DEPTH) {
        throw Error(
          `It seems like project wasn't build properly. WORKSPACE_CHAT_MAX_DEPTH = ${WORKSPACE_CHAT_MAX_DEPTH}.`
        );
      }

      if (message.depth + 1 > WORKSPACE_CHAT_MAX_DEPTH) {
        return ctx.createError({
          message: setYupError(CUSTOM_MESSAGES.CHAT_MESSAGE.MAX_DEPTH_REACHED),
        });
      }

      return true;
    }),
});

export const useAddSuperSchema: SuperSchema.Runner<
  void,
  AddControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
