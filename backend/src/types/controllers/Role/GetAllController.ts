import { RoleMapper } from "@mappers/RoleMapper";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { IPaginationOptions } from "types/IPaginationOptions";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type QueryCommon = { name?: string };

    export type QueryInput = Partial<IPaginationQuery> & QueryCommon;

    export type QueryOutput = IPaginationOptions & QueryCommon;

    export type Request = CustomRequest<void, void, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<RoleMapper>>;
  }
}
