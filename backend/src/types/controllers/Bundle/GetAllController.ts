import { WorkspaceId } from "miscellaneous-types";
import { BundleMapper } from "@mappers/BundleMapper";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type QueryInput = WorkspaceId & IPaginationQuery;

    export type QueryOutput = WorkspaceId & IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<BundleMapper>>;
  }
}
