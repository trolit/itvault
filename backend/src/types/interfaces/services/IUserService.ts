import { User } from "@entities/User";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { TransactionResult } from "types/TransactionResult";

export interface IUserService {
  reflectChangesInDataStore(entitiesToUpdate: UpdateUserDto[]): Promise<void>;

  updateMany(data: UpdateUserDto[]): Promise<TransactionResult<User[]>>;
}
