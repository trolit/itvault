import { NoteMapper } from "@mappers/NoteMapper";
import { IPaginationOptions } from "types/IPaginationOptions";
import { NoteResource } from "@shared/types/enums/NoteResource";
import { IPaginationQuery } from "@shared/types/IPaginationQuery";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type QueryCommon = { id: string; resource: NoteResource } & {
      userId?: number;
    };

    export type QueryInput = QueryCommon & IPaginationQuery;

    export type QueryOutput = QueryCommon & IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<NoteMapper>>;
  }
}
