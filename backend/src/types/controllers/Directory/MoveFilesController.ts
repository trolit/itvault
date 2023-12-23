import { IMoveFilesDto } from "@shared/types/dtos/File";
import { WorkspaceId } from "types/controllers/WorkspaceId";

export namespace MoveFilesControllerTypes {
  export namespace v1 {
    export type Body = IMoveFilesDto;

    export type Query = WorkspaceId;

    export type Request = CustomRequest<void, Body, Query>;
  }
}
