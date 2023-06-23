import bcrypt from "bcrypt";
import { Entity, Column, ManyToOne, OneToMany, BeforeInsert } from "typeorm";

import { BCRYPT } from "@config";

import { Role } from "./Role";
import { Base } from "./Base";
import { Bundle } from "./Bundle";
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

  @OneToMany(() => Bundle, bundle => bundle.createdBy, {
    cascade: ["soft-remove"],
  })
  bundles: Bundle[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, BCRYPT.SALT_ROUNDS);
  }
}
