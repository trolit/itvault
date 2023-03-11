import { Entity, Column, OneToMany } from "typeorm";

import { Base } from "./Base";
import { UserToWorkspace } from "./UserToWorkspace";

@Entity("users")
export class User extends Base {
  @Column()
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => UserToWorkspace, userToWorkspace => userToWorkspace.user)
  userToWorkspace: UserToWorkspace[];
}
