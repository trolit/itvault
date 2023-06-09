import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Variant } from "./Variant";
import { BlueprintToWorkspace } from "./BlueprintToWorkspace";

// @NOTE holds workspace's blueprint color structure from particular variant
@Entity("palettes")
export class Palette {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "json" })
  value: Record<number, string[] | string>;

  @ManyToOne(() => Variant, variant => variant.palettes)
  variant: Variant;

  @ManyToOne(
    () => BlueprintToWorkspace,
    blueprintToWorkspace => blueprintToWorkspace.palettes
  )
  blueprintToWorkspace: BlueprintToWorkspace;
}
