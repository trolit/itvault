import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { File } from "./File";

@Entity("directories")
export class Directory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  relativePath: string;

  @OneToMany(() => File, file => file.directory)
  files: File[];

  @ManyToOne(() => Directory, directory => directory.directories)
  parentDirectory: Directory;

  @OneToMany(() => Directory, directory => directory.parentDirectory)
  directories: Directory[];
}
