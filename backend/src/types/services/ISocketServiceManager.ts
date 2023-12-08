import { SocketMessage } from "@shared/types/SocketMessage";

export interface ISocketServiceManager {
  initialize(): void;

  sendMessage<T = void, Y = void>(options: {
    data?: Y;
    action: string;
    condition: (latestMessage: SocketMessage<T>) => boolean; // @NOTE specify which sockets should receive message
  }): void;
}
