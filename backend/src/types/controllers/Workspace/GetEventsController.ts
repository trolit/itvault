import { IPaginationOptions } from "types/IPaginationOptions";
import { IWorkspaceTraceDTO } from "@shared/types/DTOs/Workspace";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";

export namespace GetEventsControllerTypes {
  export namespace v1 {
    export type Params = { id: number };

    export type QueryInput = IPaginationQuery;

    export type QueryOutput = IPaginationOptions;

    export type Request = CustomRequest<Params, undefined, QueryOutput>;

    export type Response = CustomResponse<
      PaginatedResponse<IWorkspaceTraceDTO>
    >;
  }
}
