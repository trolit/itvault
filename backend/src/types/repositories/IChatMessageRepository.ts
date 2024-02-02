import { IBaseRepository } from "./IBaseRepository";
import { ChatMessage } from "@db/entities/ChatMessage";

export interface IChatMessageRepository extends IBaseRepository<ChatMessage> {}
