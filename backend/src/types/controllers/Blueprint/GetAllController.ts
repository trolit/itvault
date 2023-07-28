import { BlueprintMapDto } from "@dtos/mappers/BlueprintMapDto";
import { IPaginationQuery } from "@interfaces/IPaginationQuery";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

import { PaginatedResponse } from "miscellaneous-types";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type QueryInput = { workspaceId: number } & IPaginationQuery;

    export type QueryOutput = {
      workspaceId: number;
    } & IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<BlueprintMapDto>>;
  }
}
