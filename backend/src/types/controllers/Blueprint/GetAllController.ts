import { Blueprint } from "@entities/Blueprint";
import { BlueprintMapper } from "@mappers/BlueprintMapper";
import { WorkspaceId } from "types/controllers/WorkspaceId";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { IPaginationOptions } from "types/IPaginationOptions";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";
import { TransformedQueryFilters } from "../TransformedQueryFilters";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type QueryInput = WorkspaceId & IPaginationQuery;

    export type QueryOutput = WorkspaceId &
      IPaginationOptions & { filters: TransformedQueryFilters<Blueprint> };

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<BlueprintMapper>>;
  }
}
