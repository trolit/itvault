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
  workspaceId: number;

  @Column({
    type: "enum",
    enum: WorkspaceAccess,
    default: WorkspaceAccess.read,
  })
  access: WorkspaceAccess;

  @ManyToOne(() => User, user => user.userToWorkspace)
  user: User;

  @ManyToOne(() => Workspace, workspace => workspace.userToWorkspace)
  workspace: Workspace;
}
