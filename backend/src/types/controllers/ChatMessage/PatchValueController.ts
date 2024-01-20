import { IPatchChatMessageValueDTO } from "@shared/types/DTOs/ChatMessage";

export namespace PatchValueControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IPatchChatMessageValueDTO;

    export type Request = CustomRequest<Params, Body, undefined>;
  }
}
