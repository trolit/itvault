import { NoteMapper } from "@mappers/NoteMapper";
import { IAddNoteDTO } from "@shared/types/dtos/Note";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = IAddNoteDTO;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<NoteMapper>;
  }
}
