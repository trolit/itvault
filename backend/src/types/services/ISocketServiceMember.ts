import { SocketMessage } from "@shared/types/SocketMessage";

export interface ISocketServiceMember {
  sendMessage<T>(data: SocketMessage<T>): Promise<void>;
}
