import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
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

  @OneToOne(() => Directory, directory => directory.parentDirectory, {
    nullable: true,
  })
  parentDirectory: Directory;
}
