import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Variant } from "./Variant";
import { Blueprint } from "./Blueprint";

// @NOTE holds workspace's blueprint color structure for particular variant
@Entity("bucket")
export class Bucket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "json" })
  value: Record<number, string[]>;

  @ManyToOne(() => Blueprint, blueprint => blueprint.buckets)
  blueprint: Blueprint;

  @ManyToOne(() => Variant, variant => variant.buckets)
  variant: Variant;
}
