import { injectable } from "tsyringe";
import { ChatMessage } from "@db/entities/ChatMessage";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";

import { BaseRepository } from "./BaseRepository";

@injectable()
export class ChatMessageRepository
  extends BaseRepository<ChatMessage>
  implements IChatMessageRepository
{
  constructor() {
    super(ChatMessage);
  }
}
