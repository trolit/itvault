import { Base } from "./Base";
import { Palette } from "./Palette";
import { Workspace } from "./Workspace";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";

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

  @ManyToOne(() => Workspace, workspace => workspace.blueprints)
  workspace: Workspace;

  @OneToMany(() => Palette, palette => palette.blueprint, {
    cascade: true,
  })
  palettes: Palette[];
}
