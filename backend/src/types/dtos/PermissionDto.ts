import { Permission } from "@entities/Permission";
import { PermissionToRole } from "@entities/PermissionToRole";

export type PermissionDto = Pick<Permission, "id" | "name"> &
  Pick<PermissionToRole, "enabled">;
