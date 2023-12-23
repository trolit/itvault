import { NoteMapper } from "@mappers/NoteMapper";
import { IAddNoteDto } from "@shared/types/dtos/Note";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = IAddNoteDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<NoteMapper>;
  }
}
