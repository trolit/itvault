import {
  InsertEvent,
  EventSubscriber,
  EntitySubscriberInterface,
} from "typeorm";

import { User } from "@entities/User";
import { ChatMessage } from "@entities/ChatMessage";

@EventSubscriber()
export class ChatMessageSubscriber
  implements EntitySubscriberInterface<ChatMessage>
{
  listenTo() {
    return ChatMessage;
  }

  async beforeInsert(event: InsertEvent<ChatMessage>) {
    const { manager, entity } = event;
    const { replyTo, createdBy } = entity;

    const parentMessage = replyTo.id
      ? await manager.findOneByOrFail(ChatMessage, {
          id: replyTo.id,
        })
      : null;

    if (parentMessage) {
      entity.depth = parentMessage.depth + 1;

      parentMessage.repliesCount = (parentMessage.repliesCount || 0) + 1;

      await manager.save(parentMessage);
    } else {
      entity.depth = 1;
    }

    entity.createdBy = await manager.findOneByOrFail(User, {
      id: createdBy.id,
    });
  }
}
