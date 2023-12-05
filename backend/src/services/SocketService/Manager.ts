import { Server, Socket } from "engine.io";
import { inject, singleton } from "tsyringe";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";

import { SocketServiceMember } from "./Member";

import { Di } from "@enums/Di";

@singleton()
export class SocketServiceManager implements ISocketServiceManager {
  private _initialized: boolean;

  private _members: SocketServiceMember[];

  constructor(
    @inject(Di.EngineIO)
    private _engineIo: Server
  ) {
    this._members = [];
  }

  initialize() {
    if (this._initialized) {
      console.log("SocketService manager is already initialized!");

      return;
    }

    this._engineIo.on("connection", (socket: Socket) => {
      const member = new SocketServiceMember(socket);

      this._members.push(member);

      socket.on("close", () => {
        this._members = this._members.filter(member => !!member.sid);

        console.log(`Active sockets: ${this._members.length}`);
      });
    });

    this._initialized = true;
  }
}
