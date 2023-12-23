import { NoteMapper } from "@mappers/NoteMapper";
import { INoteAddDto } from "@shared/types/dtos/Note";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = INoteAddDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<NoteMapper>;
  }
}
