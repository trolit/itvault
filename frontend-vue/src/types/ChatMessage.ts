import type { IChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

export type ChatMessage = IChatMessageDTO & {
  replies: ChatMessage[];
};
