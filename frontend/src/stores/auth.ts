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
    status() {
      return axios.get("auth/v1/status");
    },

    async login(payload: ILoginForm) {
      const { data } = await axios.post<IProfile>("auth/v1/login", payload);

      this.profile = data;
    },
  },
});
