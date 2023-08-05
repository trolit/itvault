import { Permission } from "@entities/Permission";
import { PermissionToRole } from "@entities/PermissionToRole";

export type PermissionDto = Pick<Permission, "signature" | "name" | "group"> &
  Pick<PermissionToRole, "enabled">;
