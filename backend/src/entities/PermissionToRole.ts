import { Role } from "./Role";
import { Permission } from "./Permission";
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("permissions_roles")
export class PermissionToRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permissionId!: number;

  @Column()
  roleId!: number;

  @Column({ type: "boolean", width: 1, default: false })
  enabled!: boolean;

  @ManyToOne(() => Permission, permission => permission.permissionToRole)
  permission: Permission;

  @ManyToOne(() => Role, role => role.permissionToRole)
  role: Role;
}
