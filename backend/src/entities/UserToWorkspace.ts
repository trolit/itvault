import { Entity, Column, ManyToOne } from "typeorm";

import { Base } from "./Base";
import { User } from "./User";
import { Workspace } from "./Workspace";

@Entity("users_workspaces")
export class UserToWorkspace extends Base {
  @Column()
  userId!: number;

  @Column()
  workspaceId!: number;

  @ManyToOne(() => User, user => user.userToWorkspace)
  user: User;

  @ManyToOne(() => Workspace, workspace => workspace.userToWorkspace)
  workspace: Workspace;
}
