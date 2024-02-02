import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { PermissionToRole } from "./PermissionToRole";

import { PermissionGroup } from "@shared/types/enums/PermissionGroup";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  signature: string;

  @Column({ type: "enum", enum: PermissionGroup })
  group: PermissionGroup;

  @Column({ unique: true })
  name!: string;

  @OneToMany(
    () => PermissionToRole,
    permissionToRole => permissionToRole.permission
  )
  permissionToRole: PermissionToRole[];
}
