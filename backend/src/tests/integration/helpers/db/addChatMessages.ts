import { faker } from "@faker-js/faker";
import { ChatMessage } from "@db/entities/ChatMessage";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const addChatMessages = async (
  chatMessagesToAdd: {
    id: number;
    value?: string;
    replyToId?: number;
  }[]
) => {
  const chatMessages: ChatMessage[] = [];

  const chatMessageRepository = getInstanceOf<IChatMessageRepository>(
    Di.ChatMessageRepository
  );

  for (const chatMessageToAdd of chatMessagesToAdd) {
    const { id, replyToId, value } = chatMessageToAdd;

    const chatMessageEntity = chatMessageRepository.createEntity({
      id,
      value: value || faker.lorem.words(10),
      createdBy: {
        id: 1,
      },
      replyTo: {
        id: replyToId,
      },
    });

    const chatMessage = await chatMessageRepository.primitiveSave(
      chatMessageEntity
    );

    chatMessages.push(chatMessage);
  }

  return chatMessages;
};
