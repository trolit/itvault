import { Entity, Column, OneToMany } from "typeorm";

import { Base } from "./Base";
import { UserToWorkspace } from "./UserToWorkspace";

@Entity("workspaces")
export class Workspace extends Base {
  @Column()
  name: string;

  @Column({
    default: "",
  })
  password: string;

  @OneToMany(
    () => UserToWorkspace,
    userToWorkspace => userToWorkspace.workspace
  )
  userToWorkspace: UserToWorkspace[];
}
