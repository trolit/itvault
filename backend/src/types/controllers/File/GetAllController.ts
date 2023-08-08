import { WorkspaceId } from "miscellaneous-types";
import { FileMapper } from "@mappers/FileMapper";
import { IPaginationQuery } from "@interfaces/IPaginationQuery";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type QueryCommon = {
      blueprintId?: number;

      relativePath?: string;
    } & WorkspaceId;

    export type QueryInput = QueryCommon & IPaginationQuery;

    export type QueryOutput = QueryCommon & IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<FileMapper[]>;
  }
}
