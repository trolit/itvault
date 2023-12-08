import { UserReceiveMessage } from "@shared/types/transport/UserReceiveMessage";

export interface ISocketServiceMember {
  sendMessage<T>(data: UserReceiveMessage<T>): Promise<void>;
}
