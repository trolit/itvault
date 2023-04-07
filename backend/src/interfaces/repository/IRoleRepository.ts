import { Role } from "@entities/Role";

export interface IRoleRepository {
  getAll(): Promise<Role[]>;
}
