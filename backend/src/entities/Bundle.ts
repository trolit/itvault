import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { Variant } from "./Variant";
import { Workspace } from "./Workspace";
import { BlueprintToBundle } from "./BlueprintToBundle";

import { BundleExpire } from "@enums/BundleExpire";
import { BundleStatus } from "@enums/BundleStatus";

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

  @OneToMany(
    () => BlueprintToBundle,
    blueprintToBundle => blueprintToBundle.bundle,
    { cascade: true }
  )
  blueprintToBundle: BlueprintToBundle[];

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
