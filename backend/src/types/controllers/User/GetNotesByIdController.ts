import { NoteMapDto } from "@dtos/mappers/NoteMapDto";
import { PaginatedResponse } from "miscellaneous-types";
import { IPaginationQuery } from "@interfaces/IPaginationQuery";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetNotesByIdControllerTypes {
  export namespace v1 {
    export type CommonQuery = { userId: number };

    export type QueryInput = IPaginationQuery & CommonQuery;

    export type QueryOutput = IPaginationOptions & CommonQuery;

    export type Request = CustomRequest<undefined, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<NoteMapDto>>;
  }
}
