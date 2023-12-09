import axios from "axios";
import { defineStore } from "pinia";
import { Socket } from "engine.io-client";

import { WEBSOCKETS } from "@/config";
import type { SignInDto } from "@shared/types/dtos/SignInDto";
import SOCKET_MESSAGES from "@shared/constants/socket-messages";
import type { Permission } from "@shared/types/enums/Permission";
import type { ILoggedUserDto } from "@shared/types/dtos/ILoggedUserDto";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";
import type { SocketSendMessage } from "@shared/types/transport/SocketSendMessage";
import type { SocketReceiveMessage } from "@shared/types/transport/SocketReceiveMessage";

interface IState {
  socket: Socket | null;
  profile: ILoggedUserDto;
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

    async login(payload: SignInDto) {
      return axios.post<ILoggedUserDto>("v1/auth/sign-in", payload, {
        params: { version: 1 },
      });
    },

    async logout() {
      return axios.post("v1/auth/logout", null, {
        params: { version: 1 },
      });
    },

    async status() {
      const { data } = await axios.get<ILoggedUserDto>("v1/auth/status", {
        params: { version: 1 },
      });

      this.profile = data;

      return data;
    },

    async initializeSocket(options: {
      onMessage?: <T>(data: SocketReceiveMessage<T>) => void;
    }): Promise<void> {
      this.wasSocketInitialized = true;

      if (this.loggedUserId <= 0) {
        console.log("Sign in before attempting to initialize socket!");

        return;
      }

      const socket = new Socket(WEBSOCKETS, {
        withCredentials: true,
      });

      const { onMessage } = options;

      return new Promise(resolve => {
        socket.on("open", () => {
          this.socket = socket;

          if (onMessage) {
            socket.on("message", data => {
              let parsedData;

              try {
                parsedData = JSON.parse(data);

                onMessage(parsedData);
              } catch (error) {
                console.log("Failed to parse response!");
              }
            });
          }

          resolve();
        });
      });
    },

    socketSendMessage<T = void>(data: SocketSendMessage<T>) {
      this.socket
        ? this.socket.send(JSON.stringify(data))
        : console.log("Socket not opened yet!");
    },
  },
});
