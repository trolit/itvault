import { AddEditNoteDto } from "@dtos/AddEditNoteDto";
import { NoteMapDto } from "@dtos/NoteMapDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Request = CustomRequest<undefined, AddEditNoteDto>;

    export type Response = CustomResponse<NoteMapDto>;
  }
}
