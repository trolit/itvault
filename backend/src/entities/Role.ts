import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { PermissionToRole } from "./PermissionToRole";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @OneToMany(() => PermissionToRole, permissionToRole => permissionToRole.role)
  permissionToRole: PermissionToRole[];
}
