import { Entity, Column, OneToMany } from "typeorm";
import { Base } from "./Base";
import { UserToWorkflow } from "./UserToWorkflow";

@Entity("workflows")
export class Workflow extends Base {
  @Column()
  name: string;

  @Column({
    default: "",
  })
  password: string;

  @OneToMany(() => UserToWorkflow, userToWorkflow => userToWorkflow.workflow)
  userToWorkflows: UserToWorkflow[];
}
