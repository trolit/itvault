import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { PermissionToRole } from "./PermissionToRole";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  signature: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(
    () => PermissionToRole,
    permissionToRole => permissionToRole.permission
  )
  permissionToRole: PermissionToRole[];
}
