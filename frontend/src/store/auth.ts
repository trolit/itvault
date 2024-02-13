import axios from "axios";
import { defineStore } from "pinia";
import { Socket } from "engine.io-client";

import { WEBSOCKETS } from "@/config";
import type { IUserSessionDTO } from "@shared/types/DTOs/Auth";
import SOCKET_MESSAGES from "@shared/constants/socket-messages";
import type { Permission } from "@shared/types/enums/Permission";
import type { ISignInDTO, ILoggedUserDTO } from "@shared/types/DTOs/User";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";
import type { SocketSendMessage } from "@shared/types/transport/SocketSendMessage";

interface IState {
  socket: Socket | null;
  profile: ILoggedUserDTO;
  sessions: IUserSessionDTO[];
  wasSocketInitialized: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): IState => ({
    socket: null,
    profile: {
      id: -1,
      email: "",
      fullName: "",
      roleId: -1,
      roleName: "",
      permissions: [],
    },
    sessions: [],
    wasSocketInitialized: false,
  }),

  getters: {
    loggedUserId(): number {
      return this.profile.id;
    },

    SOCKET_MESSAGE_TYPE() {
      return SOCKET_MESSAGES;
    },
  },

  actions: {
    hasPermission(permission: Permission) {
      return isPermissionEnabled(permission, this.profile.permissions);
    },

    hasAtLeastOnePermission(permissions: Permission[]) {
      return permissions.some(permission =>
        isPermissionEnabled(permission, this.profile.permissions)
      );
    },

    async login(payload: ISignInDTO) {
      return axios.post<ILoggedUserDTO>("v1/auth/sign-in", payload, {
        params: { version: 1 },
      });
    },

    async logout() {
      this.socket?.close();

      return axios.post("v1/auth/sign-out", null, {
        params: { version: 1 },
      });
    },

    async status() {
      const { data } = await axios.get<ILoggedUserDTO>("v1/auth/status", {
        params: { version: 1 },
      });

      this.profile = data;

      return data;
    },

    async getSessions() {
      const { data } = await axios.get<IUserSessionDTO[]>("v1/auth/sessions", {
        params: { version: 1 },
      });

      this.sessions = data;
    },

    async deleteSession(id: string) {
      await axios.delete(`v1/auth/sessions/${id}`, {
        params: { version: 1 },
      });

      const index = this.sessions.findIndex(
        session => session.sessionId === id
      );

      if (~index) {
        this.sessions.splice(index, 1);
      }
    },

    initializeSocket() {
      this.wasSocketInitialized = true;

      if (this.loggedUserId <= 0) {
        console.log("Sign in before attempting to initialize socket!");

        return;
      }

      const socket = new Socket(WEBSOCKETS, {
        withCredentials: true,
      });

      socket.on("open", () => {
        this.socket = socket;
      });
    },

    socketSendMessage<T = void>(data: SocketSendMessage<T>): Promise<void> {
      return new Promise(resolve => {
        const interval = setInterval(() => {
          if (!this.socket) {
            return;
          }

          // @TODO maybe some error after e.g. 10 seconds of waiting?
          if (this.socket) {
            clearInterval(interval);

            this.socket.send(JSON.stringify(data));

            resolve();
          }
        }, 1000);
      });
    },
  },
});
