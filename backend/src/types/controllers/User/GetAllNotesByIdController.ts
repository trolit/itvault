import { NoteMapDto } from "@dtos/mappers/NoteMapDto";
import { PaginatedResponse } from "miscellaneous-types";
import { IPaginationQuery } from "@interfaces/IPaginationQuery";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetAllNotesByIdControllerTypes {
  export namespace v1 {
    export type Params = { id: number };

    export type QueryInput = Pick<IPaginationQuery, "page">;

    export type QueryOutput = IPaginationOptions;

    export type Request = CustomRequest<Params, undefined, QueryOutput>;

    export type Response = CustomResponse<PaginatedResponse<NoteMapDto>>;
  }
}
