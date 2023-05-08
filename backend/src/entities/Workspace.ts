import bcrypt from "bcrypt";
import { Entity, Column, OneToMany, BeforeInsert } from "typeorm";

import { Base } from "./Base";
import { BCRYPT_SALT_ROUNDS } from "@config/index";
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

  @OneToMany(
    () => BlueprintToWorkspace,
    blueprintToWorkspace => blueprintToWorkspace.workspace
  )
  blueprintToWorkspace: BlueprintToWorkspace[];

  @BeforeInsert()
  async hashPasswordIfProvided() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
    }
  }
}
