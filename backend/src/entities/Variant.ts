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
import { Bucket } from "./Bucket";

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

  @OneToMany(() => Bucket, bucket => bucket.variant, { cascade: true })
  buckets: Bucket[];
}
