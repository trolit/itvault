import { WorkspaceId } from "types/controllers/WorkspaceId";
import { IUpdateChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Params = {
      id: number;
    };

    export type Body = IUpdateChatMessageDTO;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
