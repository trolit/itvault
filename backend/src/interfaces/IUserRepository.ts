import { User } from "@entities/User";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(
    email: string,
    options?: { includePermissions: boolean }
  ): Promise<User | null>;

  getAll(take: number, skip: number): Promise<[User[], number]>;
}
