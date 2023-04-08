import { RoleSeeder } from "./Role";
import { UserSeeder } from "./User";
import { BlueprintSeeder } from "./Blueprint";
import { WorkspaceSeeder } from "./Workspace";
import { PermissionSeeder } from "./Permission";
import { UserToWorkspaceSeeder } from "./UserToWorkspace";
import { PermissionToRoleSeeder } from "./PermissionToRole";
import { BlueprintToWorkspaceSeeder } from "./BlueprintToWorkspace";

export const seeds = [
  RoleSeeder,
  PermissionSeeder,
  PermissionToRoleSeeder,

  UserSeeder,
  WorkspaceSeeder,
  UserToWorkspaceSeeder,

  BlueprintSeeder,
  BlueprintToWorkspaceSeeder,
];
