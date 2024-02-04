import { Entity, Column, OneToMany } from "typeorm";

import { Base } from "./Base";
import { File } from "./File";
import { Bundle } from "./Bundle";
import { Blueprint } from "./Blueprint";
import { WorkspaceEvent } from "./WorkspaceEvent";
import { TagToWorkspace } from "./TagToWorkspace";
import { UserToWorkspace } from "./UserToWorkspace";

@Entity("workspaces")
export class Workspace extends Base {
  @Column({
    unique: true,
  })
  name: string;

  @Column()
  description: string;

  @Column()
  slug: string;

  @Column({
    type: "datetime",
    default: null,
    nullable: true,
  })
  pinnedAt: Date | null;

  @OneToMany(
    () => UserToWorkspace,
    userToWorkspace => userToWorkspace.workspace
  )
  userToWorkspace: UserToWorkspace[];

  @OneToMany(() => File, file => file.workspace, { cascade: true })
  files: File[];

  @OneToMany(() => Bundle, bundle => bundle.workspace, { cascade: true })
  bundles: Bundle[];

  @OneToMany(() => Blueprint, blueprint => blueprint.workspace, {
    cascade: true,
  })
  blueprints: Blueprint[];

  @OneToMany(() => TagToWorkspace, tagToWorkspace => tagToWorkspace.workspace, {
    cascade: ["insert", "update"],
  })
  tagToWorkspace: TagToWorkspace[];

  @OneToMany(() => WorkspaceEvent, workspaceEvent => workspaceEvent.workspace)
  events: WorkspaceEvent[];
}
