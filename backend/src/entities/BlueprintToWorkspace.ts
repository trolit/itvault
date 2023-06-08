import { Entity, Column, ManyToOne, OneToMany } from "typeorm";

import { Base } from "./Base";
import { Palette } from "./Palette";
import { Blueprint } from "./Blueprint";
import { Workspace } from "./Workspace";

@Entity("blueprints_workspaces")
export class BlueprintToWorkspace extends Base {
  @Column()
  blueprintId!: number;

  @Column()
  workspaceId!: number;

  @ManyToOne(() => Blueprint, blueprint => blueprint.blueprintToWorkspace)
  blueprint: Blueprint;

  @ManyToOne(() => Workspace, workspace => workspace.blueprintToWorkspace)
  workspace: Workspace;

  @OneToMany(() => Palette, palette => palette.blueprintToWorkspace, {
    cascade: true,
  })
  palettes: Palette[];
}
