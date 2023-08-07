import { BlueprintMapDto } from "@mappers/BlueprintMapDto";
import { IPaginationQuery } from "@interfaces/IPaginationQuery";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

import { PaginatedResponse, WorkspaceId } from "miscellaneous-types";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type QueryInput = WorkspaceId & IPaginationQuery;

    export type QueryOutput = WorkspaceId & IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<BlueprintMapDto>>;
  }
}
