import { User } from "./User";
import { Variant } from "./Variant";
import { Workspace } from "./Workspace";
import { Blueprint } from "./Blueprint";
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { BundleExpire } from "@enums/BundleExpire";

@Entity("bundles")
export class Bundle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "enum", enum: BundleExpire })
  expire: BundleExpire;

  @CreateDateColumn({ nullable: true })
  expiresAt: Date | null;

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
}
