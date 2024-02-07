import { Server, Socket } from "engine.io";
import { inject, singleton } from "tsyringe";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";

import { SocketServiceMember } from "./Member";

import { Di } from "@enums/Di";
import { Service } from "@enums/Service";
import SOCKET_MESSAGES from "@shared/constants/socket-messages";
import { SocketReceiveMessage } from "@shared/types/transport/SocketReceiveMessage";

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
      log.warning({
        message: `SocketService manager is already initialized!`,
        service: Service.EngineIO,
      });

      return;
    }

    this._engineIo.on("connection", (socket: Socket) => {
      const member = new SocketServiceMember(socket);

      this._members.push(member);

      this.printMembersLength();

      socket.on("close", () => {
        this._members = this._members.filter(member => !!member.sid);

        this.printMembersLength();
      });
    });

    this._initialized = true;
  }

  private printMembersLength() {
    log.debug({
      message: `Active sockets: ${this._members.length}`,
      service: Service.EngineIO,
    });
  }

  async sendMessage<T>(
    options: SocketReceiveMessage<T> & {
      filter?: (
        members: SocketServiceMember[]
      ) => Promise<SocketServiceMember[]> | SocketServiceMember[];
    }
  ): Promise<void> {
    const { action, filter, data } = options;

    if (!this._initialized) {
      throw Error("SocketService manager not initialized!");
    }

    // @NOTE [1] determine TYPE
    const socketMessageKey = Object.keys(SOCKET_MESSAGES).find(message => {
      const actions =
        SOCKET_MESSAGES[message as keyof typeof SOCKET_MESSAGES].ACTIONS;

      return Object.values(actions).includes(action);
    });

    if (!socketMessageKey) {
      throw Error(`Unknown action (${action})!`);
    }

    const type =
      SOCKET_MESSAGES[socketMessageKey as keyof typeof SOCKET_MESSAGES].TYPE;

    let validMembers: SocketServiceMember[] = this._members;

    if (type !== SOCKET_MESSAGES.GLOBAL.TYPE) {
      validMembers = validMembers.filter(
        ({ latestMessage }) => !!latestMessage && latestMessage.type === type
      );
    }

    if (!validMembers.length) {
      return;
    }

    // @NOTE [2] handle additional filter (if provided)
    if (filter) {
      validMembers = await filter(validMembers);
    }

    for (const member of validMembers) {
      member.sendMessage<T>({ action, data });
    }
  }
}
