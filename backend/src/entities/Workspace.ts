import bcrypt from "bcrypt";
import { Entity, Column, OneToMany, BeforeInsert, InsertEvent } from "typeorm";

import { Base } from "./Base";
import { BCRYPT_SALT_ROUNDS } from "@config/index";
import { UserToWorkspace } from "./UserToWorkspace";
import { BlueprintToWorkspace } from "./BlueprintToWorkspace";

@Entity("workspaces")
export class Workspace extends Base {
  @Column()
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
  async hashPasswordIfProvided(event: InsertEvent<Workspace>) {
    const { password } = event.entity;

    if (password) {
      this.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    }
  }
}
