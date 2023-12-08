import assert from "assert";
import { Socket } from "engine.io";
import { IAuthService } from "types/services/IAuthService";
import { ISocketServiceMember } from "types/services/ISocketServiceMember";
import { IncomingAllowRequestMessage } from "types/IncomingAllowRequestMessage";

import { Di } from "@enums/Di";
import type { SocketMessage } from "@shared/types/SocketMessage";
import { UserSendMessage } from "@shared/types/transport/UserSendMessage";
import { UserReceiveMessage } from "@shared/types/transport/UserReceiveMessage";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { getTokenCookieValue } from "@helpers/getTokenCookieValue";

export class SocketServiceMember implements ISocketServiceMember {
  uid: number;

  sid: string;

  socket: Socket;

  private _cookie: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  latestMessage?: UserSendMessage<any>;

  // @NOTE we could also add here "rooms" in case we want some "events" to be global (nevertheless of page)

  constructor(socket: Socket) {
    this.socket = socket;
    this.sid = socket.transport.sid;

    const castedRequest = <IncomingAllowRequestMessage>socket.request;

    assert(castedRequest.userId);

    this.uid = castedRequest.userId;

    const cookie = getTokenCookieValue(socket.request.headers.cookie);

    assert(cookie);

    this._cookie = cookie;

    this.printMessage("Connected.");

    socket.on("message", (message: string) => {
      let parsedMessage: SocketMessage | null = null;

      try {
        parsedMessage = JSON.parse(message);
      } catch (error) {
        this.printMessage(<string>error);
      }

      if (!parsedMessage) {
        this.printMessage("Sent unparseable message. Ignoring..");

        return;
      }

      const { type } = parsedMessage;

      this.latestMessage = parsedMessage;

      this.printMessage(`Sent message of type: '${type}'`);
    });

    socket.on("close", () => {
      this.printMessage("Disconnected.");

      // @NOTE so Manager can "remove" that member
      this.sid = "";
    });
  }

  async sendMessage<T>(data: UserReceiveMessage<T>): Promise<void> {
    const canReceiveMessage = await this.isEligibleToReceiveMessage();

    if (!canReceiveMessage) {
      this.printMessage("Cannot receive message (token expired)");

      return;
    }

    this.printMessage(`Should receive '${data.action}' message.`);

    this.socket.send(JSON.stringify(data));
  }

  private async isEligibleToReceiveMessage() {
    const authService = getInstanceOf<IAuthService>(Di.AuthService);

    const result = authService.verifyToken(this._cookie);

    if (result.error) {
      return false;
    }

    return true;
  }

  private printMessage(message: string) {
    console.log(`[socket-${this.sid}]: ${message}`);
  }
}
