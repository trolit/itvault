import { Base } from "./Base";
import { File } from "./File";
import { Bundle } from "./Bundle";
import { Blueprint } from "./Blueprint";
import { UserToWorkspace } from "./UserToWorkspace";
import { Entity, Column, OneToMany } from "typeorm";

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

  @OneToMany(() => Bundle, bundle => bundle.workspace, { cascade: true })
  bundles: Bundle[];

  @OneToMany(() => Blueprint, blueprint => blueprint.workspace, {
    cascade: true,
  })
  blueprints: Blueprint[];
}
