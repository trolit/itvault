import { SocketServiceMember } from "@services/SocketService/Member";
import { SocketReceiveMessage } from "@shared/types/transport/SocketReceiveMessage";

export interface ISocketServiceManager {
  initialize(): void;

  sendMessage<T>(
    options: SocketReceiveMessage<T> & {
      filter?: (
        members: SocketServiceMember[]
      ) => Promise<SocketServiceMember[]> | SocketServiceMember[];
    }
  ): Promise<void>;
}
