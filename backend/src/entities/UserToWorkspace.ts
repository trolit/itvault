import { Entity, Column, ManyToOne } from "typeorm";

import { Base } from "./Base";
import { User } from "./User";
import { Workspace } from "./Workspace";
import { WorkspaceAccess } from "@enums/WorkspaceAccess";

@Entity("users_workspaces")
export class UserToWorkspace extends Base {
  @Column()
  userId: number;

  @Column()
  workflowId: number;

  @Column({
    type: "enum",
    enum: WorkspaceAccess,
    default: WorkspaceAccess.read,
  })
  access: WorkspaceAccess;

  @ManyToOne(() => User, user => user.userToWorkflows)
  user: User;

  @ManyToOne(() => Workspace, workspace => workspace.userToWorkspace)
  workspace: Workspace;
}
