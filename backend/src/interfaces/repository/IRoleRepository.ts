import { Role } from "@entities/Role";

export interface IRoleRepository {
  getAll(): Promise<Role[]>;

  findByName(name: string): Promise<Role | null>;
}
