import { User } from "./User";
import { PermissionToRole } from "./PermissionToRole";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => User, user => user.role)
  users: User[];

  @OneToMany(
    () => PermissionToRole,
    permissionToRole => permissionToRole.role,
    { cascade: true }
  )
  permissionToRole: PermissionToRole[];
}
