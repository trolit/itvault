import { WorkspaceId } from "types/controllers/WorkspaceId";

import { VariantMapper } from "@mappers/VariantMapper";
import { IAddVariantDTO } from "@shared/types/dtos/Variant";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = IAddVariantDTO;

    type Query = WorkspaceId;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<VariantMapper>;
  }
}
