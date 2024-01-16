import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { Base } from "./Base";
import { User } from "./User";
import { Workspace } from "./Workspace";

@Entity("chat_messages")
export class ChatMessage extends Base {
  @Column({
    type: "longtext",
  })
  value: string;

  @ManyToOne(() => Workspace, workspace => workspace.chatMessages)
  workspace: Workspace;

  @ManyToOne(() => User, user => user.chatMessages)
  createdBy: User;

  @Column({
    default: 0,
    type: "integer",
  })
  repliesCount: number;

  @ManyToOne(() => ChatMessage, service => service.replies, { nullable: true })
  replyTo: ChatMessage;

  @OneToMany(() => ChatMessage, service => service.replyTo, { nullable: true })
  replies: ChatMessage[];
}
