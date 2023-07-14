import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Tag } from "./Tag";
import { Workspace } from "./Workspace";

@Entity("tags_workspaces")
export class TagToWorkspace {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tag, tag => tag.tagToWorkspace)
  tag: Tag;

  @ManyToOne(() => Workspace, role => role.tagToWorkspace)
  workspace: Workspace;
}
