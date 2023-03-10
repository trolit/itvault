import { Entity, Column, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { User } from "./User";
import { Workflow } from "./Workflow";
import { WorkflowAccess } from "@enums/WorkflowAccess";

@Entity("users_workflows")
export class UserToWorkflow extends Base {
  @Column()
  userId: number;

  @Column()
  workflowId: number;

  @Column({ type: "enum", enum: WorkflowAccess, default: WorkflowAccess.read })
  access: WorkflowAccess;

  @ManyToOne(() => User, user => user.userToWorkflows)
  user: User;

  @ManyToOne(() => Workflow, workflow => workflow.userToWorkflows)
  workflow: Workflow;
}
