import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Variant } from "./Variant";
import { Blueprint } from "./Blueprint";

// @NOTE holds workspace's blueprint color structure from particular variant
@Entity("palettes")
export class Palette {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "json" })
  value: Record<number, string[]>;

  @ManyToOne(() => Blueprint, blueprint => blueprint.palettes)
  blueprint: Blueprint;

  @ManyToOne(() => Variant, variant => variant.palettes)
  variant: Variant;
}
