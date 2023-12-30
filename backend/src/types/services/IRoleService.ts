import { Role } from "@entities/Role";
import { IAddEditRoleDto } from "@shared/types/DTOs/Role";
import { TransactionResult } from "types/TransactionResult";

export interface IRoleService {
  create(
    userId: number,
    data: IAddEditRoleDto
  ): Promise<TransactionResult<Role>>;

  update(
    id: number,
    userId: number,
    data: IAddEditRoleDto
  ): Promise<TransactionResult<Role>>;
}
