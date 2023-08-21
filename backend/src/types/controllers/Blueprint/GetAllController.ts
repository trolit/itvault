import { BlueprintMapper } from "@mappers/BlueprintMapper";
import { WorkspaceId } from "types/controllers/WorkspaceId";
import { IPaginationOptions } from "types/IPaginationOptions";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type Common = { inUse?: number };

    export type QueryInput = WorkspaceId & IPaginationQuery & Common;

    export type QueryOutput = WorkspaceId & IPaginationOptions & Common;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<BlueprintMapper>>;
  }
}
