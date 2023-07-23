import { User } from "@entities/User";
import { LoggedUserMapDto } from "@dtos/LoggedUserMapDto";

export type Body = Pick<User, "email" | "password">;

export type Request = CustomRequest<undefined, Body>;

export type Response = CustomResponse<LoggedUserMapDto>;
