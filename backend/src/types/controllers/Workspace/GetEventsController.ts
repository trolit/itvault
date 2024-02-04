import { WorkspaceId } from "../WorkspaceId";
import { IPaginationOptions } from "types/IPaginationOptions";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";
import { WorkspaceEventMapper } from "@mappers/WorkspaceEventMapper";

export namespace GetEventsControllerTypes {
  export namespace v1 {
    type CommonQuery = {};

    export type QueryInput = WorkspaceId & IPaginationQuery & CommonQuery;

    export type QueryOutput = WorkspaceId & IPaginationOptions & CommonQuery;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<
      PaginatedResponse<WorkspaceEventMapper>
    >;
  }
}
