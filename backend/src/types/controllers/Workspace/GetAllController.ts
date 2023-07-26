import { WorkspaceMapDto } from "@dtos/mappers/WorkspaceMapDto";
import { PaginatedResponse } from "miscellaneous-types";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type Request = CustomRequest<
      undefined,
      undefined,
      IPaginationOptions
    >;

    export type Response = CustomResponse<PaginatedResponse<WorkspaceMapDto>>;
  }
}
