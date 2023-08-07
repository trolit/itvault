import { Resource } from "@enums/Resource";
import { AddNoteDto } from "@shared/types/dtos/AddNoteDto";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = Pick<AddNoteDto<Resource>, "text">;

    export type Request = CustomRequest<Params, Body>;
  }
}
