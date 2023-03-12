import { Entity, Column, OneToMany } from "typeorm";

import { Base } from "./Base";
import { BlueprintToWorkspace } from "./BlueprintToWorkspace";

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

  @OneToMany(
    () => BlueprintToWorkspace,
    blueprintToWorkspace => blueprintToWorkspace.blueprint
  )
  blueprintToWorkspace: BlueprintToWorkspace[];
}
