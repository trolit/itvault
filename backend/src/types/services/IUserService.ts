import { User } from "@entities/User";
import { IUpdateUserDTO } from "@shared/types/dtos/User";
import { TransactionResult } from "types/TransactionResult";

export interface IUserService {
  updateMany(data: IUpdateUserDTO[]): Promise<TransactionResult<User[]>>;
}
