import { WorkspaceMapper } from "@mappers/WorkspaceMapper";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { IPaginationOptions } from "types/IPaginationOptions";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type CommonQuery = {
      ignorePagination: boolean;

      filters: { userId?: number; name?: string };
    };

    export type QueryInput = Partial<IPaginationQuery> & CommonQuery;

    export type QueryOutput = IPaginationOptions & CommonQuery;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<WorkspaceMapper>>;
  }
}
