import axios from "axios";
import { defineStore } from "pinia";

import type { ILoggedUserDto } from "@shared/types/dtos/ILoggedUserDto";

import type { ILoginForm } from "@/interfaces/ILoginForm";

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

  actions: {
    async status() {
      const { data } = await axios.get<ILoggedUserDto>("v1/auth/status", {
        params: { version: 1 },
      });

      this.profile = data;

      return data;
    },

    async login(payload: ILoginForm) {
      return axios.post<ILoggedUserDto>("v1/auth/sign-in", payload, {
        params: { version: 1 },
      });
    },

    async logout() {
      return axios.post("v1/auth/logout", null, {
        params: { version: 1 },
      });
    },
  },
});
