import { Entity, Column, OneToMany, AfterLoad } from "typeorm";

import { Base } from "./Base";
import { UserToWorkspace } from "./UserToWorkspace";
import { BlueprintToWorkspace } from "./BlueprintToWorkspace";

@Entity("workspaces")
export class Workspace extends Base {
  @Column()
  name!: string;

  @Column({
    nullable: true,
    select: false,
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

  isProtected: boolean;

  @AfterLoad()
  updateCounters() {
    this.isProtected = !!this.password;
  }
}
