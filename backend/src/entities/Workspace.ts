import { Entity, Column, OneToMany } from "typeorm";

import { Tag } from "./Tag";
import { File } from "./File";
import { Base } from "./Base";
import { Bundle } from "./Bundle";
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

  @OneToMany(() => Bundle, bundle => bundle.workspace, { cascade: true })
  bundles: Bundle[];

  @OneToMany(() => Blueprint, blueprint => blueprint.workspace, {
    cascade: true,
  })
  blueprints: Blueprint[];

  @OneToMany(() => Tag, tag => tag.workspace, { cascade: ["insert"] })
  tags: Tag[];
}
