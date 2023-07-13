import { User } from "@entities/User";
import { LoggedUserMapDto } from "@dtos/LoggedUserMapDto";

// @TODO consider if we apply that idea to other controllers when working on unit tests :thinking:
export type LoginDto = CustomRequest<
  undefined,
  Pick<User, "email" | "password">
>;

export type LoggedUserDto = CustomResponse<LoggedUserMapDto>;
