import bcrypt from "bcrypt";
import { Entity, Column, ManyToOne, OneToMany, BeforeInsert } from "typeorm";

import { Base } from "./Base";
import { Role } from "./Role";
import { BCRYPT } from "@config";
import { UserToWorkspace } from "./UserToWorkspace";

@Entity("users")
export class User extends Base {
  @Column()
  email!: string;

  @Column({ select: false })
  password: string;

  @ManyToOne(() => Role, role => role.users, {
    nullable: false,
  })
  role!: Role;

  @OneToMany(() => UserToWorkspace, userToWorkspace => userToWorkspace.user)
  userToWorkspace: UserToWorkspace[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, BCRYPT.SALT_ROUNDS);
  }
}
