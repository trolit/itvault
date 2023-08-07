import { Resource } from "@enums/Resource";
import { NoteMapDto } from "@dtos/mappers/NoteMapDto";
import { AddEditNoteDto } from "@shared/types/dtos/AddEditNoteDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = AddEditNoteDto<Resource>;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<NoteMapDto>;
  }
}
