import { AddEditNoteDto } from "@dtos/AddEditNoteDto";
import { NoteMapDto } from "@dtos/mappers/NoteMapDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = AddEditNoteDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<NoteMapDto>;
  }
}
