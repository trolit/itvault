import { WorkspaceId } from "../WorkspaceId";
import { IPatchBundleNoteDTO } from "@shared/types/DTOs/Bundle";

export namespace PatchNoteControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Query = WorkspaceId;

    export type Body = IPatchBundleNoteDTO;

    export type Request = CustomRequest<Params, Body, Query>;

    export type Response = CustomResponse<string>;
  }
}
