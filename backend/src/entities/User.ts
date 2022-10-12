import { Entity, Column } from "typeorm";
import { Base } from "./Base";

@Entity()
export class User extends Base {
  @Column()
  email: string;

  @Column()
  password: string;
}
