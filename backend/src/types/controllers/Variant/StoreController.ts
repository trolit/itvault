import { WorkspaceId } from "types/controllers/WorkspaceId";

import { VariantMapper } from "@mappers/VariantMapper";
import { IAddVariantDto } from "@shared/types/dtos/Variant";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = IAddVariantDto;

    type Query = WorkspaceId;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<VariantMapper>;
  }
}
