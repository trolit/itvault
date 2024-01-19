import { IChatMessageDTO } from "../DTOs/ChatMessage";

export type AddChatMessageData = IChatMessageDTO;

export type DeleteChatMessageData = { id: number };

export type UpdateChatMessageData = Pick<IChatMessageDTO, "id" | "value">;
