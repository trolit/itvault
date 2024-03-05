import { IPatchNoteValueDTO } from "@shared/types/DTOs/Note";

export namespace PatchValueControllerTypes {
  export namespace v1 {
    export type Query = {
      workspaceId: number;
    };

    export type Params = {
      id: number;
    };

    export type Body = IPatchNoteValueDTO;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
