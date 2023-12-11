import { WorkspaceMapper } from "@mappers/WorkspaceMapper";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { IPaginationOptions } from "types/IPaginationOptions";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type Filters = {
      filters: { userId?: number };
    };

    export type QueryInput = Partial<IPaginationQuery> & Filters;

    export type QueryOutput = IPaginationOptions & Filters;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<WorkspaceMapper>>;
  }
}
