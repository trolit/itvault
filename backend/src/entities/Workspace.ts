import { Entity, Column, OneToMany } from "typeorm";

import { Base } from "./Base";
import { File } from "./File";
import { Blueprint } from "./Blueprint";
import { UserToWorkspace } from "./UserToWorkspace";

@Entity("workspaces")
export class Workspace extends Base {
  @Column({
    unique: true,
  })
  name!: string;

  @OneToMany(
    () => UserToWorkspace,
    userToWorkspace => userToWorkspace.workspace
  )
  userToWorkspace: UserToWorkspace[];

  @OneToMany(() => File, file => file.workspace, { cascade: true })
  files: File[];

  @OneToMany(() => Blueprint, blueprint => blueprint.workspace, {
    cascade: true,
  })
  blueprints: Blueprint[];
}
