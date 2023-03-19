import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { PermissionToRole } from "./PermissionToRole";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @OneToMany(
    () => PermissionToRole,
    permissionToRole => permissionToRole.permission
  )
  permissionToRole: PermissionToRole[];
}
