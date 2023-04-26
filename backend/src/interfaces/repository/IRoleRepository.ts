import { Role } from "@entities/Role";

export interface IRoleRepository {
  getAll(options?: {
    includePermissions?: boolean;
    filters?: {
      ids?: number[];
    };
  }): Promise<Role[]>;

  findByName(name: string): Promise<Role | null>;
}
