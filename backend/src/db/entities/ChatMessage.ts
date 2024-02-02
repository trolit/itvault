import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { Base } from "./Base";
import { User } from "./User";

@Entity("chat_messages")
export class ChatMessage extends Base {
  @Column({
    type: "longtext",
  })
  value: string;

  @Column({
    default: 1,
    type: "integer",
  })
  depth: number;

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
