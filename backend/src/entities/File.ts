import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { Note } from "./Note";
import { Base } from "./Base";
import { Variant } from "./Variant";
import { Workspace } from "./Workspace";

@Entity("files")
export class File extends Base {
  @Column()
  originalFilename: string;

  @Column({ default: "." })
  relativePath: string;

  @ManyToOne(() => Workspace, workspace => workspace.files)
  workspace: Workspace;

  @OneToMany(() => Variant, variant => variant.file, { cascade: true })
  variants: Variant[];

  @OneToMany(() => Note, note => note.file, { cascade: true })
  notes: Note[];
}
