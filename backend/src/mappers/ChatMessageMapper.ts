import { ChatMessage } from "@db/entities/ChatMessage";

import { BaseMapper } from "./BaseMapper";

import { IAuthorDTO } from "@shared/types/DTOs/User";
import { ITimestampsDTO } from "@shared/types/DTOs/shared";
import { IChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

export class ChatMessageMapper
  extends BaseMapper<ChatMessage>
  implements IChatMessageDTO
{
  id: number;
  value: string;
  depth: number;
  replyToId?: number;
  repliesCount: number;
  author: IAuthorDTO;
  timestamps: ITimestampsDTO;

  constructor(data: ChatMessage) {
    super(data, ["id", "value", "repliesCount", "depth"]);

    this.assignInitialKeys();

    const { createdBy, createdAt, updatedAt, replyTo } = data;

    this.author = {
      id: createdBy.id,
      fullName: createdBy.fullName,
    };

    this.timestamps = {
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };

    if (replyTo) {
      this.replyToId = replyTo.id;
    }
  }
}
