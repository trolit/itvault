import { Server, Socket } from "engine.io";
import { inject, singleton } from "tsyringe";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";

import { SocketServiceMember } from "./Member";

import { Di } from "@enums/Di";
import SOCKET_MESSAGES from "@shared/constants/socket-messages";

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

  sendMessage<T = void>(action: string, data?: T | undefined): void {
    if (!this._initialized) {
      throw Error("SocketService manager not initialized!");
    }

    const socketMessageKey = Object.keys(SOCKET_MESSAGES).find(message => {
      const actions =
        SOCKET_MESSAGES[message as keyof typeof SOCKET_MESSAGES].ACTIONS;

      return Object.values(actions).includes(action);
    });

    if (!socketMessageKey) {
      throw Error("Unknown action!");
    }

    const eligibleMembers = this._members.filter(
      member =>
        member.latestMessage &&
        member.latestMessage.type ===
          SOCKET_MESSAGES[socketMessageKey as keyof typeof SOCKET_MESSAGES].TYPE
    );

    for (const member of eligibleMembers) {
      member.sendMessage({ type: action, value: data });
    }
  }
}
