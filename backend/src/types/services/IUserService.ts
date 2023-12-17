import { User } from "@entities/User";
import { TransactionResult } from "types/TransactionResult";
import { UpdateUserDto } from "@shared/types/dtos/UpdateUserDto";

export interface IUserService {
  updateMany(data: UpdateUserDto[]): Promise<TransactionResult<User[]>>;
}
