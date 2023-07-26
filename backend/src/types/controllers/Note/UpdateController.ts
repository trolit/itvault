import { AddNoteDto } from "@dtos/AddNoteDto";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = Pick<AddNoteDto, "text">;

    export type Request = CustomRequest<Params, Body>;
  }
}
