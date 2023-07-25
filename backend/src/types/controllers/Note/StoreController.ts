import { NoteDto } from "@dtos/NoteDto";
import { NoteMapDto } from "@dtos/NoteMapDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Request = CustomRequest<undefined, NoteDto>;

    export type Response = CustomResponse<NoteMapDto>;
  }
}
