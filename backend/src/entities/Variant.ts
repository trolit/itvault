import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
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

  @ManyToOne(() => User, user => user.variants, { cascade: false })
  createdBy: User;

  @ManyToOne(() => File, file => file.variants)
  file: File;

  @OneToMany(() => Bucket, bucket => bucket.variant, { cascade: true })
  buckets: Bucket[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date | null;
}
