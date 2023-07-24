import { Note } from "@entities/Note";
import { NoteDto } from "@dtos/NoteDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Request = CustomRequest<undefined, NoteDto>;

    export type Response = CustomResponse<Note>;
  }
}
