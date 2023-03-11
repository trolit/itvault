import { Entity, Column, ManyToOne } from "typeorm";

import { Base } from "./Base";
import { Workspace } from "./Workspace";

@Entity("blueprints")
export class Blueprint extends Base {
  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToOne(() => Workspace, workspace => workspace.blueprints)
  workspace: Workspace;
}
