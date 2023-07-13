import { Entity, Column, OneToMany, PrimaryColumn } from "typeorm";

import { PermissionToRole } from "./PermissionToRole";

@Entity("permissions")
export class Permission {
  @PrimaryColumn()
  signature: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(
    () => PermissionToRole,
    permissionToRole => permissionToRole.permission
  )
  permissionToRole: PermissionToRole[];
}
