import { Role } from "@db/entities/Role";
import { IAddEditRoleDTO } from "@shared/types/DTOs/Role";
import { TransactionResult } from "types/TransactionResult";

export interface IRoleService {
  create(
    userId: number,
    data: IAddEditRoleDTO
  ): Promise<TransactionResult<Role>>;

  update(
    id: number,
    userId: number,
    data: IAddEditRoleDTO
  ): Promise<TransactionResult<Role>>;
}
