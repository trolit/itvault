import { Role } from "@entities/Role";

export type RoleDto = Pick<Role, "id" | "name">;
