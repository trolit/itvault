import axios from "axios";
import { defineStore } from "pinia";

import type { SignInDto } from "@shared/types/dtos/SignInDto";
import type { Permission } from "@shared/types/enums/Permission";
import type { ILoggedUserDto } from "@shared/types/dtos/ILoggedUserDto";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

interface IState {
  profile: ILoggedUserDto;
}

export const useAuthStore = defineStore("auth", {
  state: (): IState => ({
    profile: {
      id: -1,
      email: "",
      fullName: "",
      roleId: -1,
      roleName: "",
      permissions: [],
    },
  }),

  getters: {
    loggedUserId: state => state.profile.id,
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
  },
});
