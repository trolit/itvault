import { WorkspaceId } from "types/controllers/WorkspaceId";
import { IPatchChatMessageValueDTO } from "@shared/types/DTOs/ChatMessage";

export namespace PatchValueControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Params = {
      id: number;
    };

    export type Body = IPatchChatMessageValueDTO;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
