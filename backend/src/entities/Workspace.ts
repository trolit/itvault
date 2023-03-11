import { Entity, Column, OneToMany } from "typeorm";

import { Base } from "./Base";
import { Blueprint } from "./Blueprint";
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

  @OneToMany(() => Blueprint, blueprint => blueprint.workspace)
  blueprints: Blueprint[];
}
