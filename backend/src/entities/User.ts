import { Entity, Column, OneToMany } from "typeorm";
import { Base } from "./Base";
import { UserToWorkflow } from "./UserToWorkflow";

@Entity("users")
export class User extends Base {
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserToWorkflow, userToWorkflow => userToWorkflow.user)
  userToWorkflows: UserToWorkflow[];
}
