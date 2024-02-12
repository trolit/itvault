import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { Workspace } from "./Workspace";

import { Action } from "@shared/types/enums/Action";

@Entity("workspaces_traces")
export class WorkspaceTrace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entity: string;

  @Column()
  targetId: string;

  @Column({ type: "enum", enum: Action })
  action: Action;

  @ManyToOne(() => Workspace, workspace => workspace.traces)
  workspace: Workspace;

  @ManyToOne(() => User, user => user.workspaceTraces, { cascade: false })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
