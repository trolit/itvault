import { Permission } from "@entities/Permission";
import { PermissionToRole } from "@entities/PermissionToRole";

export type PermissionDto = Pick<Permission, "signature" | "name"> &
  Pick<PermissionToRole, "enabled">;
