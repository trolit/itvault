import { FileSeeder } from "./File";
import { RoleSeeder } from "./Role";
import { UserSeeder } from "./User";
import { PaletteSeeder } from "./Palette";
import { VariantSeeder } from "./Variant";
import { BlueprintSeeder } from "./Blueprint";
import { WorkspaceSeeder } from "./Workspace";
import { PermissionSeeder } from "./Permission";
import { UserToWorkspaceSeeder } from "./UserToWorkspace";
import { PermissionToRoleSeeder } from "./PermissionToRole";

export const seeds = [
  RoleSeeder,
  PermissionSeeder,
  PermissionToRoleSeeder,

  UserSeeder,
  WorkspaceSeeder,
  UserToWorkspaceSeeder,

  BlueprintSeeder,

  FileSeeder,
  VariantSeeder,
  PaletteSeeder,
];
