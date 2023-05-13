import { Role } from "@entities/Role";
import { Result } from "@utils/Result";
import { UpdateRoleDto } from "@dtos/UpdateRoleDto";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export interface IRoleRepository {
  getAll(options?: {
    includePermissions?: boolean;
    filters?: {
      ids?: number[] | { excluding: number[] };
    };
    pagination?: IPaginationOptions;
  }): Promise<[Role[], number]>;

  findByName(name: string): Promise<Role | null>;

  update(roleId: number, payload: UpdateRoleDto): Promise<Result<Role>>;
}
