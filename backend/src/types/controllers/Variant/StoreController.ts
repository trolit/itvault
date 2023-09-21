import { WorkspaceId } from "types/controllers/WorkspaceId";

import { VariantMapper } from "@mappers/VariantMapper";
import { AddVariantDto } from "@shared/types/dtos/AddVariantDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = AddVariantDto;

    type Query = WorkspaceId;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<VariantMapper>;
  }
}
