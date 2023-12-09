import { SocketSendMessage } from "@shared/types/transport/SocketSendMessage";
import { SocketReceiveMessage } from "@shared/types/transport/SocketReceiveMessage";
import { SocketServiceMember } from "@services/SocketService/Member";

export interface ISocketServiceManager {
  initialize(): void;

  sendMessage<T>(
    options: SocketReceiveMessage<T> & {
      restrictMembers?: (
        members: SocketServiceMember[]
      ) => Promise<SocketServiceMember[]> | SocketServiceMember[];
    }
  ): void | Promise<void>;
}
