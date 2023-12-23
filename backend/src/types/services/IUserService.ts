import { User } from "@entities/User";
import { IUpdateUserDto } from "@shared/types/dtos/User";
import { TransactionResult } from "types/TransactionResult";

export interface IUserService {
  updateMany(data: IUpdateUserDto[]): Promise<TransactionResult<User[]>>;
}
