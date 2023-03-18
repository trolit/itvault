import { Entity, Column } from "typeorm";

import { Base } from "./Base";

@Entity("roles")
export class Role extends Base {
  @Column()
  name!: string;

  @Column()
  permissions!: string;
}
