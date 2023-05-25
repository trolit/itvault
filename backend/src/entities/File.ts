import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Workspace } from "./Workspace";

@Entity("files")
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalFilename: string;

  @Column({ default: "." })
  relativePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Workspace, workspace => workspace.files)
  workspace: Workspace;

  // @TODO variants
}
