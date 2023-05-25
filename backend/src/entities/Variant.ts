import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { File } from "./File";

@Entity("variants")
export class Variant {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  filename: string;

  @Column()
  size: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => File, file => file.variants)
  file: File;
}
