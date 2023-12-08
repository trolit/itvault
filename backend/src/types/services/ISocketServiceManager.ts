import { UserSendMessage } from "@shared/types/transport/UserSendMessage";
import { UserReceiveMessage } from "@shared/types/transport/UserReceiveMessage";

export interface ISocketServiceManager {
  initialize(): void;

  sendMessage<T, Y = void>(
    options: UserReceiveMessage<T> & {
      condition: (latestMessage: UserSendMessage<Y>) => boolean;
    }
  ): void;
}
