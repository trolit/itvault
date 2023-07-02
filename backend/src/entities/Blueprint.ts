import { Entity, Column, ManyToOne, OneToMany } from "typeorm";

import { Base } from "./Base";
import { Bucket } from "./Bucket";
import { Workspace } from "./Workspace";

@Entity("blueprints")
export class Blueprint extends Base {
  @Column()
  name!: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column()
  color!: string;

  @ManyToOne(() => Workspace, workspace => workspace.blueprints)
  workspace: Workspace;

  @OneToMany(() => Bucket, bucket => bucket.blueprint, {
    cascade: true,
  })
  buckets: Bucket[];
}
