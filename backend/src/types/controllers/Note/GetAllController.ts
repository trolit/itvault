import { Resource } from "@enums/Resource";
import { NoteMapper } from "@mappers/NoteMapper";
import { PaginatedResponse } from "miscellaneous-types";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type QueryCommon = { id: string; resource: Resource } & {
      userId?: number;
    };

    export type QueryInput = QueryCommon & IPaginationQuery;

    export type QueryOutput = QueryCommon & IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<NoteMapper>>;
  }
}
