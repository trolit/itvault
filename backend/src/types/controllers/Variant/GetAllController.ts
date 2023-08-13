import { WorkspaceId } from "types/controllers/WorkspaceId";

import { VariantMapper } from "@mappers/VariantMapper";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type Query = {
      fileId: number;
    } & WorkspaceId;

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<VariantMapper[]>;
  }
}
