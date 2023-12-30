import { WorkspaceId } from "types/controllers/WorkspaceId";
import { IPatchRelativePathDTO } from "@shared/types/DTOs/File";

export namespace PatchRelativePathControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IPatchRelativePathDTO;

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
