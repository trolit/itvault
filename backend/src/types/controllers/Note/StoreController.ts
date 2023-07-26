import { AddNoteDto } from "@dtos/AddNoteDto";
import { NoteMapDto } from "@dtos/mappers/NoteMapDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Request = CustomRequest<undefined, AddNoteDto>;

    export type Response = CustomResponse<NoteMapDto>;
  }
}
