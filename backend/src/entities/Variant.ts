import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { File } from "./File";
import { Palette } from "./Palette";

@Entity("variants")
export class Variant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  filename: string;

  @Column()
  size: number; // @NOTE in bytes

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => File, file => file.variants)
  file: File;

  @OneToMany(() => Palette, palette => palette.variant, { cascade: true })
  palettes: Palette[];
}
