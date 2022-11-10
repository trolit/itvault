import axios from "axios";
import { defineStore } from "pinia";

import type { ILoginForm } from "@/interfaces/ILoginForm";

interface IState {
  profile: IProfile;
}

interface IProfile {
  email: string;
}

export const useAuthStore = defineStore("auth", {
  state: (): IState => ({
    profile: {
      email: "",
    },
  }),

  actions: {
    async status() {
      const { data } = await axios.get<IProfile>("auth/v1/status");

      this.profile = data;
    },

    async login(payload: ILoginForm) {
      const { data } = await axios.post<IProfile>("auth/v1/login", payload);

      this.profile = data;
    },
  },
});
