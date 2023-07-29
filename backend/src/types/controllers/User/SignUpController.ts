import { SignUpDto } from "@dtos/SignUpDto";

export namespace SignUpControllerTypes {
  export namespace v1 {
    export type Body = SignUpDto;

    export type Request = CustomRequest<undefined, Body>;
  }
}
