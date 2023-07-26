import { VariantMapDto } from "@dtos/mappers/VariantMapDto";
import { PaginatedResponse } from "miscellaneous-types";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type Query = {
      fileId: number;

      workspaceId: number;
    };

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<PaginatedResponse<VariantMapDto>>;
  }
}
