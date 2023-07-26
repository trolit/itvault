import { BlueprintMapDto } from "@dtos/mappers/BlueprintMapDto";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

import { PaginatedResponse } from "miscellaneous-types";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type Query = {
      workspaceId: number;
    } & IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<PaginatedResponse<BlueprintMapDto>>;
  }
}
