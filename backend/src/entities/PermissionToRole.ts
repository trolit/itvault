import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Role } from "./Role";
import { Permission } from "./Permission";

@Entity("permissions_roles")
export class PermissionToRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permissionId!: number;

  @Column()
  roleId!: number;

  @Column({ type: "boolean" })
  enabled!: boolean;

  @ManyToOne(() => Permission, permission => permission.permissionToRole)
  permission: Permission;

  @ManyToOne(() => Role, role => role.permissionToRole)
  role: Role;
}
