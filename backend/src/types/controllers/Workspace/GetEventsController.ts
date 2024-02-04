import { IPaginationOptions } from "types/IPaginationOptions";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";
import { WorkspaceEventMapper } from "@mappers/WorkspaceEventMapper";

export namespace GetEventsControllerTypes {
  export namespace v1 {
    export type Params = { id: number };

    export type QueryInput = IPaginationQuery;

    export type QueryOutput = IPaginationOptions;

    export type Request = CustomRequest<Params, undefined, QueryOutput>;

    export type Response = CustomResponse<
      PaginatedResponse<WorkspaceEventMapper>
    >;
  }
}
