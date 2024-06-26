import { ILoggedUserDTO, ISignInDTO } from "@shared/types/DTOs/Auth";

export namespace SignInControllerTypes {
  export namespace v1 {
    export type Body = ISignInDTO;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<ILoggedUserDTO>;
  }
}
