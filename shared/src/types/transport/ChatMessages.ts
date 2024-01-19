import { IChatMessageDTO } from "../DTOs/ChatMessage";

export type AddChatMessageData = IChatMessageDTO;

export type DeleteChatMessageData = Pick<IChatMessageDTO, "id">;

export type UpdateChatMessageData = Pick<IChatMessageDTO, "id" | "value">;
