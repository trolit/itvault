import axios from "axios";
import { defineStore } from "pinia";

import type { ILoginForm } from "@/interfaces/ILoginForm";

interface IState {
  profile: object;
}

export const useAuthStore = defineStore("auth", {
  state: (): IState => ({
    profile: {},
  }),

  actions: {
    isAuthenticated() {
      return axios.get("auth/v1/is-authenticated");
    },

    async login(payload: ILoginForm) {
      const data = await axios.post("auth/v1/login", payload);

      this.profile = data;
    },
  },
});
