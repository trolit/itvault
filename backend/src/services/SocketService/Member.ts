import assert from "assert";
import { Socket } from "engine.io";
import { IAuthService } from "types/services/IAuthService";
import { ISocketServiceMember } from "types/services/ISocketServiceMember";

import { Di } from "@enums/Di";
import type { SocketMessage } from "@shared/types/SocketMessage";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { getTokenCookieValue } from "@helpers/getTokenCookieValue";

export class SocketServiceMember implements ISocketServiceMember {
  sid: string;

  socket: Socket;

  private _cookie: string;

  latestMessage?: SocketMessage;

  // @NOTE we could also add here "rooms" in case we want some "events" to be global (nevertheless of page)

  constructor(socket: Socket) {
    this.socket = socket;
    this.sid = socket.transport.sid;

    const cookie = getTokenCookieValue(socket.request.headers.cookie);

    assert(cookie);

    this._cookie = cookie;

    this.printMessage("Connected.");

    socket.on("message", (message: string) => {
      let parsedMessage: SocketMessage | null = null;

      // xd; token=eyJhb

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

  async sendMessage<T>(data: SocketMessage<T>): Promise<void> {
    const canReceiveMessage = await this.isEligibleToReceiveMessage();

    if (!canReceiveMessage) {
      this.printMessage("Cannot receive message (token expired)");

      return;
    }

    this.printMessage(`Should receive '${data.type}' message.`);

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