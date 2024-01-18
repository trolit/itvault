import { BaseMapper } from "./BaseMapper";

import { ChatMessage } from "@entities/ChatMessage";
import { IAuthorDTO } from "@shared/types/DTOs/User";
import { ITimestampsDTO } from "@shared/types/DTOs/shared";
import { IChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

export class ChatMessageMapper
  extends BaseMapper<ChatMessage>
  implements IChatMessageDTO
{
  id: number;
  value: string;
  repliesCount: number;
  author: IAuthorDTO;
  timestamps: ITimestampsDTO;

  constructor(data: ChatMessage) {
    super(data, ["id", "value", "repliesCount"]);

    this.assignInitialKeys();

    const { createdBy, createdAt, updatedAt, deletedAt, repliesCount } = data;

    if (!repliesCount) {
      this.repliesCount = 0;
    }

    this.author = {
      id: createdBy.id,
      fullName: createdBy.fullName,
    };

    this.timestamps = {
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      deletedAt: deletedAt?.toISOString() || "",
    };

    return this;
  }
}
