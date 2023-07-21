import {
  Entity,
  ManyToOne,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Bundle } from "./Bundle";
import { Variant } from "./Variant";

@Entity("variants_bundles")
export class VariantToBundle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Variant, variant => variant.variantToBundle)
  variant: Variant;

  @ManyToOne(() => Bundle, bundle => bundle.variantToBundle)
  bundle: Bundle;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date | null;
}
