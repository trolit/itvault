import { IPatchFilenameDto } from "@shared/types/dtos/File";
import { WorkspaceId } from "types/controllers/WorkspaceId";

export namespace PatchFilenameControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IPatchFilenameDto;

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
