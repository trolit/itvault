import { Role } from "@entities/Role";
import { AddEditRoleDto } from "@dtos/AddEditRoleDto";
import { TransactionResult } from "types/TransactionResult";

export interface IRoleService {
  create(data: AddEditRoleDto): Promise<TransactionResult<Role>>;

  update(id: number, data: AddEditRoleDto): Promise<TransactionResult<Role>>;
}
