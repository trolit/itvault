import {
  Entity,
  ManyToOne,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Bundle } from "./Bundle";
import { Blueprint } from "./Blueprint";

@Entity("blueprints_bundles")
export class BlueprintToBundle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Blueprint, blueprint => blueprint.blueprintToBundle)
  blueprint: Blueprint;

  @ManyToOne(() => Bundle, bundle => bundle.blueprintToBundle)
  bundle: Bundle;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date | null;
}
