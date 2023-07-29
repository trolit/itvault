import { PaginatedResponse } from "miscellaneous-types";
import { BundleMapDto } from "@dtos/mappers/BundleMapDto";
import { IPaginationQuery } from "@interfaces/IPaginationQuery";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type QueryInput = { workspaceId: number } & IPaginationQuery;

    export type QueryOutput = {
      workspaceId: number;
    } & IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<BundleMapDto>>;
  }
}
