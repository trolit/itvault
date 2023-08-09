import { UserMapper } from "@mappers/UserMapper";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type QueryInput = IPaginationQuery;

    export type QueryOutput = IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<UserMapper>>;
  }
}
