import axios from "axios";
import { defineStore } from "pinia";

import type { ILoginForm } from "@/interfaces/ILoginForm";

interface IState {
  profile: IProfile;
}

type Permission = {
  id: number;
  signature: string;
  name: string;
  enabled: boolean;
};

export interface IProfile {
  id: number;

  email: string;

  fullName: string;

  roleName: string;

  permissions: Permission[];
}

export const useAuthStore = defineStore("auth", {
  state: (): IState => ({
    profile: {
      id: -1,
      email: "",
      fullName: "",
      roleName: "",
      permissions: [],
    },
  }),

  actions: {
    async status() {
      return axios.get<IProfile>("v1/auth/status", {
        params: { version: 1 },
      });
    },

    async login(payload: ILoginForm) {
      return axios.post<IProfile>("v1/auth/sign-in", payload, {
        params: { version: 1 },
      });
    },
  },
});
