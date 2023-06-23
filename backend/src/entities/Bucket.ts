import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Variant } from "./Variant";
import { Blueprint } from "./Blueprint";

import { BucketContent } from "miscellaneous-types";

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
