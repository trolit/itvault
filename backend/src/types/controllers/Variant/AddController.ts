import { WorkspaceId } from "types/controllers/WorkspaceId";

import { VariantMapper } from "@mappers/VariantMapper";
import { IAddVariantDTO } from "@shared/types/DTOs/Variant";

export namespace AddControllerTypes {
  export namespace v1 {
    export type Body = IAddVariantDTO;

    type Query = WorkspaceId;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<VariantMapper>;
  }
}
