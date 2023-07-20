import { User } from "@entities/User";
import { LoggedUserMapDto } from "@dtos/LoggedUserMapDto";

export type Body = Pick<User, "email" | "password">;

// @TODO consider if we apply that idea to other controllers when working on unit tests :thinking:
export type LoginDto = CustomRequest<
  undefined,
  { email: string; password: string }
>;

export type LoggedUserDto = CustomResponse<LoggedUserMapDto>;
