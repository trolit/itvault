import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { File } from "./File";
import { DirectoryToWorkspace } from "./DirectoryToWorkspace";

@Entity("directories")
export class Directory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  relativePath: string;

  @OneToMany(() => File, file => file.directory)
  files: File[];

  @OneToMany(
    () => DirectoryToWorkspace,
    directoryToWorkspace => directoryToWorkspace.directory,
    {
      cascade: ["insert", "update"],
    }
  )
  directoryToWorkspace: DirectoryToWorkspace[];
}
