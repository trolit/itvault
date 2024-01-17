import { ChatMessageMapper } from "@mappers/ChatMessageMapper";
import { IAddChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

export namespace AddControllerTypes {
  export namespace v1 {
    export type Query = {
      workspaceId: number;
    };

    export type Body = IAddChatMessageDTO;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<ChatMessageMapper>;
  }
}
