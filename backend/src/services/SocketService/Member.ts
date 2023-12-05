import { Socket } from "engine.io";
import { ISocketServiceMember } from "types/services/ISocketServiceMember";

import SOCKET_MESSAGES from "@shared/constants/socket-messages";

export class SocketServiceMember implements ISocketServiceMember {
  sid: string;

  socket: Socket;

  currentPage: string;

  // @NOTE we could also add here "rooms" in case we want some "events" to be global (nevertheless of page)

  constructor(socket: Socket) {
    this.socket = socket;
    this.currentPage = "";
    this.sid = socket.transport.sid;

    this.printMessage("Connected.");

    socket.on("message", (type, value) => {
      this.printMessage(`Sent message of type: '${type}'`);

      if (type === SOCKET_MESSAGES.WORKSPACE.VIEW) {
        console.log("view..");
      }

      // socket.request.headers.cookie
    });

    socket.on("close", () => {
      this.printMessage("Disconnected.");

      // @NOTE so Manager can "remove" that member
      this.sid = "";
    });
  }

  sendMessage<T>(type: string, value?: T | undefined): void {
    this.printMessage(`Should receive '${type}' message.`);

    if (value) {
      this.socket.send(type, value);
    } else {
      this.socket.send(type);
    }
  }

  private printMessage(message: string) {
    console.log(`[socket-${this.sid}]: ${message}`);
  }
}
