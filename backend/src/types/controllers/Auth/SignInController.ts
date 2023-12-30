import { ISignInDTO } from "@shared/types/dtos/User";
import { LoggedUserMapper } from "@mappers/LoggedUserMapper";

export namespace SignInControllerTypes {
  export namespace v1 {
    export type Body = ISignInDTO;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<LoggedUserMapper>;
  }
}
