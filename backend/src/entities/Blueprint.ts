import { Entity, Column, ManyToOne, OneToMany } from "typeorm";

import { Base } from "./Base";
import { Bucket } from "./Bucket";
import { Workspace } from "./Workspace";
import { BlueprintToBundle } from "./BlueprintToBundle";

@Entity("blueprints")
export class Blueprint extends Base {
  @Column()
  name!: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column()
  color!: string;

  @ManyToOne(() => Workspace, workspace => workspace.blueprints, {
    cascade: false,
  })
  workspace: Workspace;

  @OneToMany(() => Bucket, bucket => bucket.blueprint, {
    cascade: true,
  })
  buckets: Bucket[];

  @OneToMany(
    () => BlueprintToBundle,
    blueprintToBundle => blueprintToBundle.blueprint,
    { cascade: true }
  )
  blueprintToBundle: BlueprintToBundle[];

  static FILTERABLE_FIELDS = ["name", "color", "buckets.variant.id"];
}
