import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { TagToWorkspace } from "./TagToWorkspace";

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => TagToWorkspace, tagToWorkspace => tagToWorkspace.tag, {
    cascade: false,
  })
  tagToWorkspace: TagToWorkspace[];
}
