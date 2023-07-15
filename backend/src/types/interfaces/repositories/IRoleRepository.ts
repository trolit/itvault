import { Role } from "@entities/Role";
import { UpdateRoleDto } from "@dtos/UpdateRoleDto";
import { IBaseRepository } from "./IBaseRepository";

export interface IRoleRepository extends IBaseRepository<Role> {
  update(roleId: number, data: UpdateRoleDto): Promise<Role | null>;
}
