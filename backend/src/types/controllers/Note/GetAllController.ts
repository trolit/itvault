import { AddEditNoteDto } from "@dtos/AddEditNoteDto";
import { NoteMapDto } from "@dtos/mappers/NoteMapDto";
import { PaginatedResponse } from "miscellaneous-types";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetAllControllerTypes {
  export namespace v1 {
    type Query = Pick<AddEditNoteDto, "id" | "resource"> & IPaginationOptions;

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<PaginatedResponse<NoteMapDto>>;
  }
}
