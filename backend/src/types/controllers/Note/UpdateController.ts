import { IUpdateNoteDTO } from "@shared/types/DTOs/Note";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IUpdateNoteDTO;

    export type Request = CustomRequest<Params, Body>;
  }
}
