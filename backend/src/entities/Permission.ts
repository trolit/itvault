import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { PermissionToRole } from "./PermissionToRole";

import { PermissionGroup } from "@enums/PermissionGroup";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  signature: string;

  @Column()
  group: PermissionGroup;

  @Column({ unique: true })
  name!: string;

  @OneToMany(
    () => PermissionToRole,
    permissionToRole => permissionToRole.permission
  )
  permissionToRole: PermissionToRole[];
}
