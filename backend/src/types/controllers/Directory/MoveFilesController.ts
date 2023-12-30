import { IMoveFilesDTO } from "@shared/types/DTOs/File";
import { WorkspaceId } from "types/controllers/WorkspaceId";

export namespace MoveFilesControllerTypes {
  export namespace v1 {
    export type Body = IMoveFilesDTO;

    export type Query = WorkspaceId;

    export type Request = CustomRequest<void, Body, Query>;
  }
}
