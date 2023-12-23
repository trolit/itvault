import { WorkspaceId } from "types/controllers/WorkspaceId";
import { IPatchRelativePathDto } from "@shared/types/dtos/File";

export namespace PatchRelativePathControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IPatchRelativePathDto;

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
