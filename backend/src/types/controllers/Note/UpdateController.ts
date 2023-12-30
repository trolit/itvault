import { IUpdateNoteDTO } from "@shared/types/dtos/Note";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IUpdateNoteDTO;

    export type Request = CustomRequest<Params, Body>;
  }
}
