import { SocketReceiveMessage } from "@shared/types/transport/SocketReceiveMessage";

export interface ISocketServiceMember {
  sendMessage<T>(data: SocketReceiveMessage<T>): Promise<void>;
}
