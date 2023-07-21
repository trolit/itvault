import { Tag } from "@entities/Tag";
import { Note } from "@entities/Note";
import { Role } from "@entities/Role";
import { File } from "@entities/File";
import { User } from "@entities/User";
import { Bundle } from "@entities/Bundle";
import { Bucket } from "@entities/Bucket";
import { Variant } from "@entities/Variant";
import { Blueprint } from "@entities/Blueprint";
import { Workspace } from "@entities/Workspace";
import { Permission } from "@entities/Permission";
import { TagToWorkspace } from "@entities/TagToWorkspace";
import { VariantToBundle } from "@entities/VariantToBundle";
import { UserToWorkspace } from "@entities/UserToWorkspace";
import { PermissionToRole } from "@entities/PermissionToRole";
import { BlueprintToBundle } from "@entities/BlueprintToBundle";

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
  BlueprintToBundle,
  VariantToBundle,
];
