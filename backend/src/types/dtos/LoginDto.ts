import { User } from "@entities/User";

export type LoginDto = Pick<User, "email" | "password">;
