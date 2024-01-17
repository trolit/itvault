import { IAuthorDTO } from "./User";
import { ITimestampsDTO } from "./shared";

export interface IChatMessageDTO {
  id: number;

  value: string;

  repliesCount: number;

  author: IAuthorDTO;

  timestamps: ITimestampsDTO;
}

export interface IAddChatMessageDTO {
  text: string;

  replyToId?: number;
}

export interface IUpdateChatMessageDTO {
  text: string;
}
