import { IBaseRepository } from "./IBaseRepository";
import { ChatMessage } from "@entities/ChatMessage";

export interface IChatMessageRepository extends IBaseRepository<ChatMessage> {}
