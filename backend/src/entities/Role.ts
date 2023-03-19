import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { User } from "./User";
import { PermissionToRole } from "./PermissionToRole";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @OneToMany(() => User, user => user.role)
  users: User[];

  @OneToMany(() => PermissionToRole, permissionToRole => permissionToRole.role)
  permissionToRole: PermissionToRole[];
}
