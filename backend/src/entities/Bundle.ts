import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { Variant } from "./Variant";
import { Blueprint } from "./Blueprint";
import { Workspace } from "./Workspace";

import { BundleStatus } from "@enums/BundleStatus";
import { BundleExpire } from "@enums/BundleExpire";

@Entity("bundles")
export class Bundle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  note: string;

  @Column({ type: "enum", enum: BundleExpire })
  expire: BundleExpire;

  @CreateDateColumn({ nullable: true })
  expiresAt: Date | null;

  @Column({ type: "enum", enum: BundleStatus })
  status: BundleStatus;

  @Column()
  size: number; // @NOTE in bytes

  @ManyToOne(() => Workspace, workspace => workspace.bundles)
  workspace: Workspace;

  @ManyToOne(() => User, user => user.bundles)
  createdBy: User;

  @ManyToMany(() => Blueprint, { cascade: true })
  @JoinTable({ name: "bundles_blueprints" })
  blueprints: Blueprint[];

  @ManyToMany(() => Variant, { cascade: true })
  @JoinTable({ name: "bundles_variants" })
  variants: Variant[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date | null;
}
