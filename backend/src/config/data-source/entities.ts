import { User } from "@entities/User";
import { Blueprint } from "@entities/Blueprint";
import { Workspace } from "@entities/Workspace";
import { UserToWorkspace } from "@entities/UserToWorkspace";
import { BlueprintToWorkspace } from "@entities/BlueprintToWorkspace";

export const entities = [
  User,
  Workspace,
  UserToWorkspace,
  Blueprint,
  BlueprintToWorkspace,
];
