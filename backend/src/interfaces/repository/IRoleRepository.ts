import { FindOptionsWhere } from "typeorm";

import { Role } from "@entities/Role";

export interface IRoleRepository {
  getAll(options?: {
    includePermissions: boolean;
    where?: FindOptionsWhere<Role>;
  }): Promise<Role[]>;

  findByName(name: string): Promise<Role | null>;
}
