import { SocketSendMessage } from "@shared/types/transport/SocketSendMessage";
import { SocketReceiveMessage } from "@shared/types/transport/SocketReceiveMessage";
import { SocketServiceMember } from "@services/SocketService/Member";

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
