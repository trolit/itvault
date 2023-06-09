import bcrypt from "bcrypt";
import { Entity, Column, OneToMany, BeforeInsert } from "typeorm";

import { Base } from "./Base";
import { File } from "./File";
import { BCRYPT } from "@config";
import { UserToWorkspace } from "./UserToWorkspace";
import { BlueprintToWorkspace } from "./BlueprintToWorkspace";

@Entity("workspaces")
export class Workspace extends Base {
  @Column({
    unique: true,
  })
  name!: string;

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

  @BeforeInsert()
  async hashPasswordIfProvided() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, BCRYPT.SALT_ROUNDS);
    }
  }
}
