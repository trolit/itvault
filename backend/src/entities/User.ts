import { Entity, Column } from "typeorm";
import { Base } from "./Base";

@Entity("users")
export class User extends Base {
  @Column()
  email: string;

  @Column()
  password: string;
}
