import { WorkspaceId } from "types/controllers/WorkspaceId";

import { FileVariantMapper } from "@mappers/FileVariantMapper";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type Query = {
      blueprintId?: number;

      relativePath?: string;
    } & WorkspaceId;

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<FileVariantMapper[]>;
  }
}
