import { User } from "@entities/User";

export type SignUpDto = Pick<User, "email" | "id" | "signUpCode" | "password">;
