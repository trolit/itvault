import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Note } from "./Note";
import { Variant } from "./Variant";
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

  @OneToMany(() => Variant, variant => variant.file, { cascade: true })
  variants: Variant[];

  // @OneToMany(() => Note, note => note.file, { cascade: true })
  // notes: Note[];
}
