import { Role } from "@entities/Role";
import { IRoleAddEditDto } from "@shared/types/dtos/Role";
import { TransactionResult } from "types/TransactionResult";

export interface IRoleService {
  create(
    userId: number,
    data: IRoleAddEditDto
  ): Promise<TransactionResult<Role>>;

  update(
    id: number,
    userId: number,
    data: IRoleAddEditDto
  ): Promise<TransactionResult<Role>>;
}
