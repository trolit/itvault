import { Column, Entity, ManyToOne } from "typeorm";

import { User } from "./User";
import { Base } from "./Base";
import { Variant } from "./Variant";
import { Blueprint } from "./Blueprint";

import { BucketContent } from "@shared/types/BucketContent";

@Entity("buckets")
export class Bucket extends Base {
  @Column({ type: "json" })
  value: BucketContent;

  @ManyToOne(() => Blueprint, blueprint => blueprint.buckets)
  blueprint: Blueprint;

  @ManyToOne(() => Variant, variant => variant.buckets)
  variant: Variant;

  @ManyToOne(() => User, { cascade: false })
  createdBy: User;

  @ManyToOne(() => User, { cascade: false })
  updatedBy: User;
}
