import { Role } from "@entities/Role";

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
}
