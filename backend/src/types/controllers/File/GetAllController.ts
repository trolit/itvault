import { WorkspaceId } from "types/controllers/WorkspaceId";

import { FileMapper } from "@mappers/FileMapper";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type Query = {
      blueprintId?: number;

      relativePath?: string;
    } & WorkspaceId;

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<FileMapper[]>;
  }
}
