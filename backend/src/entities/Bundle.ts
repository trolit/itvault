import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { Workspace } from "./Workspace";

@Entity("bundles")
export class Bundle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Workspace, workspace => workspace.bundles)
  workspace: Workspace;

  @ManyToOne(() => User, user => user.bundles)
  createdBy: User;
}
