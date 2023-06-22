import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { PermissionToRole } from "./PermissionToRole";
import { IPermissionDefinition } from "@interfaces/config/IPermissionDefinition";

@Entity("permissions")
export class Permission implements IPermissionDefinition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(
    () => PermissionToRole,
    permissionToRole => permissionToRole.permission
  )
  permissionToRole: PermissionToRole[];
}
