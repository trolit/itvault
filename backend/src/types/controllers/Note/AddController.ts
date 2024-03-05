import { WorkspaceId } from "../WorkspaceId";
import { NoteMapper } from "@mappers/NoteMapper";
import { IAddNoteDTO } from "@shared/types/DTOs/Note";

export namespace AddControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Body = IAddNoteDTO;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<NoteMapper>;
  }
}
