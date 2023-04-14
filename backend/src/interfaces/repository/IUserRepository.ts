import { User } from "@entities/User";
import { Result } from "@utils/Result";
import { IBaseRepository } from "./IBaseRepository";
import { UpdateUserDto } from "@dtos/UpdateUserDto";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(
    email: string,
    options?: { includePermissions: boolean }
  ): Promise<User | null>;

  getAll(take: number, skip: number): Promise<[User[], number]>;

  updateMany(
    entitiesToUpdate: UpdateUserDto[]
  ): Promise<Result<UpdateUserDto[]>>;
}
