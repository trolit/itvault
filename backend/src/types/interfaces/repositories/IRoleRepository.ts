import { Role } from "@entities/Role";
import { Result } from "types/Result";
import { UpdateRoleDto } from "@dtos/UpdateRoleDto";
import { IBaseRepository } from "./IBaseRepository";

export interface IRoleRepository extends IBaseRepository<Role> {
  save(roleId: number, payload: UpdateRoleDto): Promise<Result<Role>>;
}
