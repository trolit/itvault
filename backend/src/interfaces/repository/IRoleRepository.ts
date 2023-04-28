import { Role } from "@entities/Role";
import { Result } from "@utils/Result";
import { UpdateRoleDto } from "@dtos/UpdateRoleDto";

export interface IRoleRepository {
  getAll(options?: {
    includePermissions?: boolean;
    filters?: {
      ids?: number[] | { excluding: number[] };
    };
    pagination?: {
      take: number;
      skip: number;
    };
  }): Promise<[Role[], number]>;

  findByName(name: string): Promise<Role | null>;

  update(roleId: number, payload: UpdateRoleDto): Promise<Result<Role>>;
}
