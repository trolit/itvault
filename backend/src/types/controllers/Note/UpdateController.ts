import { AddEditNoteDto } from "@dtos/AddEditNoteDto";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = Pick<AddEditNoteDto, "text">;

    export type Request = CustomRequest<Params, Body>;
  }
}
