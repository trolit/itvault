import { User } from "@entities/User";
import { IBaseRepository } from "./IBaseRepository";
import { UpdateUserDto } from "@dtos/UpdateUserDto";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(
    email: string,
    options?: { includePermissions: boolean }
  ): Promise<User | null>;
}
