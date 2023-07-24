import { Note } from "@entities/Note";
import { NoteDto } from "@dtos/NoteDto";
import { PaginatedResponse } from "miscellaneous-types";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type Query = Pick<NoteDto, "id" | "resource"> & IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<PaginatedResponse<Note>>;
  }
}
