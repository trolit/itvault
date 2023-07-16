import { Result } from "types/Result";
import { User } from "@entities/User";
import { UpdateUserDto } from "@dtos/UpdateUserDto";

export interface IUserService {
  reflectChangesInDataStore(entitiesToUpdate: UpdateUserDto[]): Promise<void>;

  updateMany(data: UpdateUserDto[]): Promise<Result<User[]>>;
}
