import { NoteMapper } from "@mappers/NoteMapper";
import { AddNoteDto } from "@shared/types/dtos/AddNoteDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = AddNoteDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<NoteMapper>;
  }
}
