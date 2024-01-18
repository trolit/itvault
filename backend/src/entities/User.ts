import bcrypt from "bcrypt";
import { Entity, Column, ManyToOne, OneToMany, BeforeInsert } from "typeorm";

import { BCRYPT } from "@config";

import { Base } from "./Base";
import { Role } from "./Role";
import { Bundle } from "./Bundle";
import { Variant } from "./Variant";
import { ChatMessage } from "./ChatMessage";
import { UserToWorkspace } from "./UserToWorkspace";

@Entity("users")
export class User extends Base {
  @Column()
  email!: string;

  @Column({ select: false, nullable: true })
  password: string;

  // @NOTE allow to update firstName/lastName through profile settings (?)
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    generatedType: "VIRTUAL",
    asExpression: `CONCAT(firstName,' ',lastName)`,
  })
  fullName: string;

  @Column({
    nullable: true,
  })
  signUpCode: string;

  @Column({ type: "boolean", width: 1, default: false })
  isSignedUp: boolean;

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

  // @TODO move to subscriber!
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, BCRYPT.SALT_ROUNDS);
    }
  }

  @ManyToOne(() => User, User => User.createdBy, {
    nullable: true,
    cascade: false,
  })
  createdBy: User | null;

  @OneToMany(() => ChatMessage, chatMessage => chatMessage.createdBy, {
    cascade: ["soft-remove"],
  })
  chatMessages: ChatMessage[];
}
