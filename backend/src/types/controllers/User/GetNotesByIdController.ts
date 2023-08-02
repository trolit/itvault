import { NoteMapDto } from "@dtos/mappers/NoteMapDto";
import { PaginatedResponse } from "miscellaneous-types";
import { IPaginationQuery } from "@interfaces/IPaginationQuery";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetNotesByIdControllerTypes {
  export namespace v1 {
    export type Params = { id: number };

    export type QueryInput = IPaginationQuery;

    export type QueryOutput = IPaginationOptions;

    export type Request = CustomRequest<Params, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<NoteMapDto>>;
  }
}
