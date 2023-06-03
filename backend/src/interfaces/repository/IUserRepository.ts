import { User } from "@entities/User";
import { Result } from "@utils/Result";
import { IBaseRepository } from "./IBaseRepository";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(
    email: string,
    options?: { includePermissions: boolean }
  ): Promise<User | null>;

  getAll(options: {
    pagination: IPaginationOptions;
  }): Promise<[User[], number]>;

  updateMany(
    entitiesToUpdate: UpdateUserDto[]
  ): Promise<Result<UpdateUserDto[]>>;

  isPermittedToAccessWorkspace(
    userId: number,
    workspaceId: number
  ): Promise<boolean>;
}
