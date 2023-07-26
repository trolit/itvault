import { User } from "@entities/User";
import { LoggedUserMapDto } from "@dtos/mappers/LoggedUserMapDto";

export namespace SignInControllerTypes {
  export namespace v1 {
    export type Body = Pick<User, "email" | "password">;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<LoggedUserMapDto>;
  }
}
