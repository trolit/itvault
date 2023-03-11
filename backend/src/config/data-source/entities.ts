import { User } from "@entities/User";
import { Blueprint } from "@entities/Blueprint";
import { Workspace } from "@entities/Workspace";
import { UserToWorkspace } from "@entities/UserToWorkspace";

export const entities = [User, Workspace, UserToWorkspace, Blueprint];
