import { WorkspaceId } from "types/controllers/WorkspaceId";
import { MoveFilesDto } from "@shared/types/dtos/MoveFilesDto";

export namespace MoveFilesControllerTypes {
  export namespace v1 {
    export type Body = MoveFilesDto;

    export type Query = WorkspaceId;

    export type Request = CustomRequest<void, Body, Query>;
  }
}
