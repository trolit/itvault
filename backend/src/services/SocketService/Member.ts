import { Socket } from "engine.io";
import { ISocketServiceMember } from "types/services/ISocketServiceMember";

export class SocketServiceMember implements ISocketServiceMember {
  sid: string;

  socket: Socket;

  currentPage: string;

  // @NOTE we could also add here "rooms" in case we want some "events" to be global (nevertheless of page)

  constructor(socket: Socket) {
    this.socket = socket;
    this.sid = socket.transport.sid;

    this.printMessage("Connected.");

    socket.on("message", msg => {
      this.printMessage(`Received message: ${msg}`);
      // socket.request.headers.cookie
    });

    socket.on("close", () => {
      this.printMessage("Disconnected.");

      // @NOTE so Manager can "remove" that member
      this.sid = "";
    });
  }

  private printMessage(message: string) {
    console.log(`[socket-${this.sid}]: ${message}`);
  }
}
