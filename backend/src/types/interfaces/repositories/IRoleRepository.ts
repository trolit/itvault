import { Role } from "@entities/Role";
import { AddEditRoleDto } from "@dtos/AddEditRoleDto";
import { IBaseRepository } from "./IBaseRepository";

export interface IRoleRepository extends IBaseRepository<Role> {
  create(data: AddEditRoleDto): Promise<Role | null>;

  update(roleId: number, data: AddEditRoleDto): Promise<Role | null>;
}
