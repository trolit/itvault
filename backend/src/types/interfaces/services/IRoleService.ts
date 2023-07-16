import { Role } from "@entities/Role";
import { AddEditRoleDto } from "@dtos/AddEditRoleDto";

export interface IRoleService {
  create(data: AddEditRoleDto): Promise<Role | null>;

  update(id: number, data: AddEditRoleDto): Promise<Role | null>;
}
