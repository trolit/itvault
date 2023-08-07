import { Resource } from "@enums/Resource";
import { NoteMapDto } from "@dtos/mappers/NoteMapDto";
import { AddNoteDto } from "@shared/types/dtos/AddNoteDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = AddNoteDto<Resource>;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<NoteMapDto>;
  }
}
