import { injectable } from "tsyringe";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";

import { BaseRepository } from "./BaseRepository";

import { ChatMessage } from "@entities/ChatMessage";

@injectable()
export class ChatMessageRepository
  extends BaseRepository<ChatMessage>
  implements IChatMessageRepository
{
  constructor() {
    super(ChatMessage);
  }
}
