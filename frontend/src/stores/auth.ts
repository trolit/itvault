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
    status() {
      return axios.get("auth/v1/status");
    },

    async login(payload: ILoginForm) {
      const data = await axios.post("auth/v1/login", payload);

      this.profile = data;
    },
  },
});
