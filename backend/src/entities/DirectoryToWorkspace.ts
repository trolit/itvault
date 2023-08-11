import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Directory } from "./Directory";
import { Workspace } from "./Workspace";

@Entity("directories_workspaces")
export class DirectoryToWorkspace {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Directory, directory => directory.directoryToWorkspace)
  directory: Directory;

  @ManyToOne(() => Workspace, workspace => workspace.directoryToWorkspace)
  workspace: Workspace;
}
