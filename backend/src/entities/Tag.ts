import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Workspace } from "./Workspace";

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Workspace, workspace => workspace.tags, {
    cascade: false,
    nullable: true,
  })
  workspace: Workspace;
}
