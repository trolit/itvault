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

@Entity("workspace_events")
export class WorkspaceEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entity: string;

  @Column()
  targetId: string;

  @Column({ type: "enum", enum: Action })
  action: Action;

  @ManyToOne(() => Workspace, workspace => workspace.events)
  workspace: Workspace;

  @ManyToOne(() => User, user => user.workspaceEvents, { cascade: false })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
