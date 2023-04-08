import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  InsertEvent,
} from "typeorm";
import bcrypt from "bcrypt";

import { Base } from "./Base";
import { Role } from "./Role";
import { UserToWorkspace } from "./UserToWorkspace";
import { BCRYPT_SALT_ROUNDS } from "@config/index";

@Entity("users")
export class User extends Base {
  @Column()
  email!: string;

  @Column()
  password!: string;

  @ManyToOne(() => Role, role => role.users, {
    nullable: false,
  })
  role!: Role;

  @OneToMany(() => UserToWorkspace, userToWorkspace => userToWorkspace.user)
  userToWorkspace: UserToWorkspace[];

  @BeforeInsert()
  async hashPassword(event: InsertEvent<User>) {
    this.password = await bcrypt.hash(
      event.entity.password,
      BCRYPT_SALT_ROUNDS
    );
  }
}
