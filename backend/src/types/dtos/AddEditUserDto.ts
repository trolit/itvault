import { User } from "@entities/User";

export type AddEditUserDto = Pick<User, "email" | "firstName" | "lastName"> & {
  roleId: number;
};
