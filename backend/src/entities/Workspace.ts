import { Entity, Column, OneToMany } from "typeorm";

import { Base } from "./Base";
import { UserToWorkspace } from "./UserToWorkspace";
import { BlueprintToWorkspace } from "./BlueprintToWorkspace";

@Entity("workspaces")
export class Workspace extends Base {
  @Column()
  name!: string;

  @Column({
    nullable: true,
  })
  password: string;

  @OneToMany(
    () => UserToWorkspace,
    userToWorkspace => userToWorkspace.workspace
  )
  userToWorkspace: UserToWorkspace[];

  @OneToMany(
    () => BlueprintToWorkspace,
    blueprintToWorkspace => blueprintToWorkspace.workspace
  )
  blueprintToWorkspace: BlueprintToWorkspace[];
}
