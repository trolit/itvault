import { File } from "@entities/File";
import { Role } from "@entities/Role";
import { User } from "@entities/User";
import { Variant } from "@entities/Variant";
import { Blueprint } from "@entities/Blueprint";
import { Workspace } from "@entities/Workspace";
import { Permission } from "@entities/Permission";
import { UserToWorkspace } from "@entities/UserToWorkspace";
import { PermissionToRole } from "@entities/PermissionToRole";
import { BlueprintToWorkspace } from "@entities/BlueprintToWorkspace";

export const entities = [
  Permission,
  Role,
  PermissionToRole,
  User,
  Workspace,
  UserToWorkspace,
  Blueprint,
  BlueprintToWorkspace,
  File,
  Variant,
];
