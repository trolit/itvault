import bcrypt from "bcrypt";
import { Entity, Column, ManyToOne, OneToMany, BeforeInsert } from "typeorm";

import { BCRYPT } from "@config";

import { Role } from "./Role";
import { Base } from "./Base";
import { Bundle } from "./Bundle";
import { Variant } from "./Variant";
import { UserToWorkspace } from "./UserToWorkspace";

@Entity("users")
export class User extends Base {
  @Column()
  email!: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    generatedType: "VIRTUAL",
    asExpression: `CONCAT("users"."firstName", ' ', "users"."lastName") FROM "users"`,
  })
  fullName: string;

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

  @OneToMany(() => Variant, variant => variant.createdBy, { cascade: false })
  variants: Variant[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, BCRYPT.SALT_ROUNDS);
  }
}
