import { Tag } from "@entities/Tag";
import { Role } from "@entities/Role";
import { File } from "@entities/File";
import { Note } from "@entities/Note";
import { User } from "@entities/User";
import { Bundle } from "@entities/Bundle";
import { Bucket } from "@entities/Bucket";
import { Variant } from "@entities/Variant";
import { Workspace } from "@entities/Workspace";
import { Blueprint } from "@entities/Blueprint";
import { Permission } from "@entities/Permission";
import { TagToWorkspace } from "@entities/TagToWorkspace";
import { UserToWorkspace } from "@entities/UserToWorkspace";
import { PermissionToRole } from "@entities/PermissionToRole";

export const entities = [
  Permission,
  Role,
  PermissionToRole,
  User,
  File,
  Variant,
  Blueprint,
  Workspace,
  UserToWorkspace,
  Bundle,
  Bucket,
  Note,
  Tag,
  TagToWorkspace,
];
