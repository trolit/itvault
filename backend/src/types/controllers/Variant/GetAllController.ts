import { WorkspaceId } from "miscellaneous-types";
import { VariantMapper } from "@mappers/VariantMapper";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type Query = {
      fileId: number;
    } & WorkspaceId;

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<PaginatedResponse<VariantMapper>>;
  }
}
