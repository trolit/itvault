import { Column, Entity, ManyToOne } from "typeorm";

import { Base } from "./Base";
import { File } from "./File";
import { User } from "./User";

@Entity("notes")
export class Note extends Base {
  @Column({
    type: "longtext",
  })
  value: string;

  @ManyToOne(() => User, { cascade: false })
  createdBy: User;

  @ManyToOne(() => User, { cascade: false })
  updatedBy: User;

  @ManyToOne(() => File, file => file.notes, { cascade: false })
  file: File;
}
