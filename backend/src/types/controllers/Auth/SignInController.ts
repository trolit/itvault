import { SignInDto } from "@shared/types/dtos/SignInDto";
import { LoggedUserMapDto } from "@dtos/mappers/LoggedUserMapDto";

export namespace SignInControllerTypes {
  export namespace v1 {
    export type Body = SignInDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<LoggedUserMapDto>;
  }
}
