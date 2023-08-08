import { User } from "@entities/User";
import { TransactionResult } from "types/TransactionResult";
import { UpdateUserDto } from "@shared/types/dtos/UpdateUserDto";

export interface IUserService {
  reflectChangesInDataStore(entitiesToUpdate: UpdateUserDto[]): Promise<void>;

  updateMany(data: UpdateUserDto[]): Promise<TransactionResult<User[]>>;
}
