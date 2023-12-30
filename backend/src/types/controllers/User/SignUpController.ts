import { ISignUpDTO } from "@shared/types/dtos/User";

export namespace SignUpControllerTypes {
  export namespace v1 {
    export type Body = ISignUpDTO;

    export type Request = CustomRequest<undefined, Body>;
  }
}
