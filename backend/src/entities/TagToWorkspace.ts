import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Tag } from "./Tag";
import { Workspace } from "./Workspace";

@Entity("tags_workspaces")
export class TagToWorkspace {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tag, tag => tag.tagToWorkspace, {
    cascade: false,
  })
  tag: Tag;

  @ManyToOne(() => Workspace, role => role.tagToWorkspace, { cascade: false })
  workspace: Workspace;
}
