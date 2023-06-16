import bcrypt from "bcrypt";
import { Entity, Column, OneToMany, BeforeInsert } from "typeorm";

import { Base } from "./Base";
import { File } from "./File";
import { BCRYPT } from "@config";
import { Blueprint } from "./Blueprint";
import { UserToWorkspace } from "./UserToWorkspace";

@Entity("workspaces")
export class Workspace extends Base {
  @Column({
    unique: true,
  })
  name!: string;

  // @DEPRECATED (remove it as we will do Workspace Log + confirmation instead :thinking:)
  @Column({
    nullable: true,
  })
  password: string;

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

  @BeforeInsert()
  async hashPasswordIfProvided() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, BCRYPT.SALT_ROUNDS);
    }
  }
}
