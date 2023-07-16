import { Result } from "types/Result";
import { Role } from "@entities/Role";
import { AddEditRoleDto } from "@dtos/AddEditRoleDto";

export interface IRoleService {
  create(data: AddEditRoleDto): Promise<Result<Role>>;

  update(id: number, data: AddEditRoleDto): Promise<Result<Role>>;
}
