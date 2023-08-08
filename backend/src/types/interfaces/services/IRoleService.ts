import { Role } from "@entities/Role";
import { TransactionResult } from "types/TransactionResult";
import { AddEditRoleDto } from "@shared/types/dtos/AddEditRoleDto";

export interface IRoleService {
  create(data: AddEditRoleDto): Promise<TransactionResult<Role>>;

  update(id: number, data: AddEditRoleDto): Promise<TransactionResult<Role>>;
}
