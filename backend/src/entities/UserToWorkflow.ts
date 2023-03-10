import { Entity, Column, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { User } from "./User";
import { Workflow } from "./Workflow";
import { WorkflowAccess } from "@enums/WorkflowAccess";

@Entity("users_workflows")
export class UserToWorkflow extends Base {
  @Column()
  public userId: number;

  @Column()
  public workflowId: number;

  @Column({ type: "enum", enum: WorkflowAccess, default: WorkflowAccess.read })
  public access: WorkflowAccess;

  @ManyToOne(() => User, user => user.workflows)
  public user: User;

  @ManyToOne(() => Workflow, workflow => workflow.users)
  public workflow: Workflow;
}
