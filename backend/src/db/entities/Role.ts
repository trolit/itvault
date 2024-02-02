import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { PermissionToRole } from "./PermissionToRole";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  description: string;

  @OneToMany(() => User, user => user.role)
  users: User[];

  @OneToMany(
    () => PermissionToRole,
    permissionToRole => permissionToRole.role,
    { cascade: true }
  )
  permissionToRole: PermissionToRole[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { cascade: false, nullable: true })
  createdBy: User;

  @ManyToOne(() => User, { cascade: false, nullable: true })
  updatedBy: User;
}
