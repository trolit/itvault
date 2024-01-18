import sanitizeHtml from "sanitize-html";
import { number, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { AddControllerTypes } from "types/controllers/ChatMessage/AddController";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";

import { Di } from "@enums/Di";
import { WORKSPACE_CHAT_MAX_DEPTH } from "@shared/constants/config";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<AddControllerTypes.v1.Query> = object({
  workspaceId: number().required(),
});

const bodySchema: SuperSchema.Fragment<AddControllerTypes.v1.Body> = object({
  text: string()
    .required()
    .transform(value => sanitizeHtml(value)),

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
  AddControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
    query: querySchema,
  };
});
