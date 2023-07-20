import { User } from "@entities/User";
import { LoggedUserMapDto } from "@dtos/LoggedUserMapDto";

export type Body = Pick<User, "email" | "password">;

// @TODO consider if we apply that idea to other controllers when working on unit tests :thinking:
export type SignInDto = CustomRequest<undefined, Body>;

export type LoggedUserDto = CustomResponse<LoggedUserMapDto>;
