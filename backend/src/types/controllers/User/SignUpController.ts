import { ISignUpDto } from "@shared/types/dtos/User";

export namespace SignUpControllerTypes {
  export namespace v1 {
    export type Body = ISignUpDto;

    export type Request = CustomRequest<undefined, Body>;
  }
}
