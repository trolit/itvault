import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Variant } from "./Variant";
import { Blueprint } from "./Blueprint";

import { BucketContent } from "miscellaneous-types";

// @NOTE holds workspace's blueprint color structure for particular variant
@Entity("buckets")
export class Bucket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "json" })
  value: BucketContent;

  @ManyToOne(() => Blueprint, blueprint => blueprint.buckets)
  blueprint: Blueprint;

  @ManyToOne(() => Variant, variant => variant.buckets)
  variant: Variant;
}
