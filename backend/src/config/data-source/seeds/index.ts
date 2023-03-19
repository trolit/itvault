import { UserSeeder } from "./User";
import { BlueprintSeeder } from "./Blueprint";
import { WorkspaceSeeder } from "./Workspace";
import { PermissionSeeder } from "./Permission";
import { UserToWorkspaceSeeder } from "./UserToWorkspace";
import { BlueprintToWorkspaceSeeder } from "./BlueprintToWorkspace";

export const seeds = [
  PermissionSeeder,
  UserSeeder,
  WorkspaceSeeder,
  UserToWorkspaceSeeder,
  BlueprintSeeder,
  BlueprintToWorkspaceSeeder,
];
