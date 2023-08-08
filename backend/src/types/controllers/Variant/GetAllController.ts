import { VariantMapper } from "@mappers/VariantMapper";
import { PaginatedResponse, WorkspaceId } from "miscellaneous-types";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type Query = {
      fileId: number;
    } & WorkspaceId;

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<PaginatedResponse<VariantMapper>>;
  }
}
