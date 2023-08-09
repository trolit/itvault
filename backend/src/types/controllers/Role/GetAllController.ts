import { RoleMapper } from "@mappers/RoleMapper";
import { PaginatedResponse } from "miscellaneous-types";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type QueryInput = IPaginationQuery;

    export type QueryOutput = IPaginationOptions;

    export type Request = CustomRequest<void, void, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<RoleMapper>>;
  }
}
