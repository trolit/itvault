import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { Variant } from "./Variant";
import { Blueprint } from "./Blueprint";
import { Workspace } from "./Workspace";

import { BundleExpire } from "@enums/BundleExpire";
import { BundleStatus } from "@enums/BundleStatus";

@Entity("bundles")
export class Bundle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  filename: string | null;

  @Column({ nullable: true })
  note: string | null;

  @CreateDateColumn()
  createdAt: Date;

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

  // @NOTE consider removing it and leave only `blueprints`
  @ManyToMany(() => Variant, { cascade: true })
  @JoinTable({ name: "bundles_variants" })
  variants: Variant[];
}
