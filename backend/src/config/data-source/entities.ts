import { File } from "@entities/File";
import { Role } from "@entities/Role";
import { User } from "@entities/User";
import { Bundle } from "@entities/Bundle";
import { Palette } from "@entities/Bucket";
import { Variant } from "@entities/Variant";
import { Blueprint } from "@entities/Blueprint";
import { Workspace } from "@entities/Workspace";
import { Permission } from "@entities/Permission";
import { UserToWorkspace } from "@entities/UserToWorkspace";
import { PermissionToRole } from "@entities/PermissionToRole";

export const entities = [
  Permission,
  Role,
  PermissionToRole,
  User,
  Workspace,
  UserToWorkspace,
  Blueprint,
  File,
  Variant,
  Palette,
  Bundle,
];
