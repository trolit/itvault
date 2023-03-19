import { Entity, Column, OneToMany, ManyToOne } from "typeorm";

import { Base } from "./Base";
import { Role } from "./Role";
import { UserToWorkspace } from "./UserToWorkspace";

@Entity("users")
export class User extends Base {
  @Column()
  email!: string;

  @Column()
  password!: string;

  @ManyToOne(() => Role, role => role.users)
  role!: Role;

  @OneToMany(() => UserToWorkspace, userToWorkspace => userToWorkspace.user)
  userToWorkspace: UserToWorkspace[];
}
