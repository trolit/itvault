import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("files")
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalFilename: string;

  @Column({ default: "." })
  relativePath: string;

  @CreateDateColumn()
  createdAt: Date;

  // @TODO workspaceId

  // @TODO variants
}
