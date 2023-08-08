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
import { VariantToBundle } from "./VariantToBundle";

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

  @OneToMany(
    () => VariantToBundle,
    variantToBundle => variantToBundle.variant,
    {
      cascade: true,
    }
  )
  variantToBundle: VariantToBundle[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date | null;
}
