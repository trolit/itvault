import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { Note } from "./Note";
import { Base } from "./Base";
import { Variant } from "./Variant";
import { Workspace } from "./Workspace";
import { Directory } from "./Directory";

@Entity("files")
export class File extends Base {
  @Column()
  originalFilename: string;

  @ManyToOne(() => Workspace, workspace => workspace.files)
  workspace: Workspace;

  @ManyToOne(() => Directory, directory => directory.files)
  directory: Directory;

  @OneToMany(() => Variant, variant => variant.file, { cascade: true })
  variants: Variant[];

  @OneToMany(() => Note, note => note.file, { cascade: true })
  notes: Note[];
}
