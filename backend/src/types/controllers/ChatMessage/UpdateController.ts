import { IUpdateChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IUpdateChatMessageDTO;

    export type Request = CustomRequest<Params, Body>;
  }
}
