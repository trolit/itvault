import { Role } from "@entities/Role";
import { Result } from "@utils/Result";
import { UpdateRoleDto } from "@dtos/UpdateRoleDto";
import { IBaseRepository } from "./IBaseRepository";

export interface IRoleRepository extends IBaseRepository<Role> {
  findByName(name: string): Promise<Role | null>;

  update(roleId: number, payload: UpdateRoleDto): Promise<Result<Role>>;
}
