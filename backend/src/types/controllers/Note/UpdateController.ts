import { AddEditNoteDto } from "@dtos/AddEditNoteDto";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = AddEditNoteDto;

    export type Request = CustomRequest<Params, Body>;
  }
}
