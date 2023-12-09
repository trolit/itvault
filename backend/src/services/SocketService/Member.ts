import assert from "assert";
import { Socket } from "engine.io";
import { IAuthService } from "types/services/IAuthService";
import { ISocketServiceMember } from "types/services/ISocketServiceMember";
import { IncomingAllowRequestMessage } from "types/IncomingAllowRequestMessage";

import { Di } from "@enums/Di";
import { SocketSendMessage } from "@shared/types/transport/SocketSendMessage";
import { SocketReceiveMessage } from "@shared/types/transport/SocketReceiveMessage";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { getTokenCookieValue } from "@helpers/getTokenCookieValue";

export class SocketServiceMember implements ISocketServiceMember {
  uid: number;

  sid: string;

  private socket: Socket;

  private _cookie: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  latestMessage?: SocketSendMessage<any>;

  getLatestMessageValue<T>(): T | undefined {
    return this.latestMessage?.data;
  }

  constructor(socket: Socket) {
    // @NOTE [1] assign information
    this.socket = socket;
    this.sid = socket.transport.sid;

    const cookie = getTokenCookieValue(socket.request.headers.cookie);
    const castedRequest = <IncomingAllowRequestMessage>socket.request;

    assert(cookie);
    assert(castedRequest.userId);

    this.uid = castedRequest.userId;

    this._cookie = cookie;

    this.printMessage("Connected.");

    // @NOTE [2] configure events
    socket.on("message", (message: string) => {
      let parsedMessage: SocketSendMessage | null = null;

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

  async sendMessage<T>(data: SocketReceiveMessage<T>): Promise<void> {
    const authService = getInstanceOf<IAuthService>(Di.AuthService);

    const result = authService.verifyToken(this._cookie);

    if (result.error) {
      this.printMessage("Won't receive message (token expired)");

      return;
    }

    this.printMessage(`Should receive '${data.action}' message.`);

    this.socket.send(JSON.stringify(data));
  }

  private printMessage(message: string) {
    console.log(`[socket-${this.sid}]: ${message}`);
  }
}
