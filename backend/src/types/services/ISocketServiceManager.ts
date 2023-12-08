import { UserSendMessage } from "@shared/types/transport/UserSendMessage";
import { UserReceiveMessage } from "@shared/types/transport/UserReceiveMessage";
import { SocketServiceMember } from "@services/SocketService/Member";

export interface ISocketServiceManager {
  initialize(): void;

  sendMessage<T>(
    options: UserReceiveMessage<T> & {
      restrictMembers?: (
        members: SocketServiceMember[]
      ) => Promise<SocketServiceMember[]> | SocketServiceMember[];
    }
  ): void | Promise<void>;
}
