import assert from "assert";
import { Socket } from "engine.io";
import { IAuthService } from "types/services/IAuthService";
import { ISocketServiceMember } from "types/services/ISocketServiceMember";
import { IncomingAllowRequestMessage } from "types/IncomingAllowRequestMessage";

import { Di } from "@enums/Di";
import { Service } from "@enums/Service";
import { SocketSendMessage } from "@shared/types/transport/SocketSendMessage";
import { SocketReceiveMessage } from "@shared/types/transport/SocketReceiveMessage";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { getTokenCookieValue } from "@helpers/getTokenCookieValue";

export class SocketServiceMember implements ISocketServiceMember {
  uid: number;

  sid: string;

  private _token: string;

  private _socket: Socket;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  latestMessage?: SocketSendMessage<any>;

  getLatestMessageValue<T>(): T | undefined {
    return this.latestMessage?.data;
  }

  constructor(socket: Socket) {
    // @NOTE [1] assign information
    this._socket = socket;
    this.sid = socket.transport.sid;

    const token = getTokenCookieValue(socket.request.headers.cookie);
    const castedRequest = <IncomingAllowRequestMessage>socket.request;

    assert(token);
    assert(castedRequest.userId);

    this.uid = castedRequest.userId;

    this._token = token;

    this._printMessage("connected.");

    // @NOTE [2] configure events
    socket.on("message", (message: string) => {
      let parsedMessage: SocketSendMessage | null = null;

      try {
        parsedMessage = JSON.parse(message);
      } catch (error) {
        this._printMessage(<string>error);
      }

      if (!parsedMessage) {
        this._printMessage("sent unparseable message. Ignoring...");

        return;
      }

      const { type } = parsedMessage;

      this.latestMessage = parsedMessage;

      this._printMessage(`sent message of type: '${type}'`);
    });

    socket.on("close", () => {
      this._printMessage("disconnected.");

      // @NOTE so Manager can "remove" that member
      this.sid = "";
    });
  }

  async sendMessage<T>(data: SocketReceiveMessage<T>): Promise<void> {
    const authService = getInstanceOf<IAuthService>(Di.AuthService);

    const result = authService.verifyToken(this._token);

    if (result.error) {
      this._printMessage("won't receive message (token expired)");

      return;
    }

    this._printMessage(`should receive '${data.action}' message.`);

    this._socket.send(JSON.stringify(data));
  }

  private _printMessage(message: string) {
    log.debug({
      message: `Socket ${this.sid} ${message}`,
      service: Service.EngineIO,
    });
  }
}
