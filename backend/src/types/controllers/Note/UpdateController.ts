import { IUpdateNoteDto } from "@shared/types/dtos/Note";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IUpdateNoteDto;

    export type Request = CustomRequest<Params, Body>;
  }
}
