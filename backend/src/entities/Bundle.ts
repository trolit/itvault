import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { Workspace } from "./Workspace";
import { VariantToBundle } from "./VariantToBundle";
import { BlueprintToBundle } from "./BlueprintToBundle";

import { BundleExpire } from "@shared/types/enums/BundleExpire";
import { BundleStatus } from "@shared/types/enums/BundleStatus";

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

  @OneToMany(() => VariantToBundle, variantToBundle => variantToBundle.bundle, {
    cascade: true,
  })
  variantToBundle: VariantToBundle[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date | null;
}
