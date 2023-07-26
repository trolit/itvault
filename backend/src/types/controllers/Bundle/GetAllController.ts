import { PaginatedResponse } from "miscellaneous-types";
import { BundleMapDto } from "@dtos/mappers/BundleMapDto";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type Query = {
      workspaceId: number;
    } & IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<PaginatedResponse<BundleMapDto>>;
  }
}
