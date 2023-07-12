import { TagSeeder } from "./Tag";
import { UserSeeder } from "./User";
import { FileSeeder } from "./File";
import { RoleSeeder } from "./Role";
import { BucketSeeder } from "./Bucket";
import { VariantSeeder } from "./Variant";
import { WorkspaceSeeder } from "./Workspace";
import { BlueprintSeeder } from "./Blueprint";
import { PermissionSeeder } from "./Permission";
import { UserToWorkspaceSeeder } from "./UserToWorkspace";
import { PermissionToRoleSeeder } from "./PermissionToRole";

export const seeds = [
  RoleSeeder,
  PermissionSeeder,
  PermissionToRoleSeeder,

  UserSeeder,
  TagSeeder,
  WorkspaceSeeder,
  UserToWorkspaceSeeder,

  BlueprintSeeder,

  FileSeeder,
  VariantSeeder,
  BucketSeeder,
];
