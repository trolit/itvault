import { defineStore } from "pinia";

import { THEME_DARK } from "@/assets/constants/themes";
import { LoadingState } from "@/types/enums/LoadingState";

interface IState {
  theme: string;
  loadingState: LoadingState;
}

export const useGeneralStore = defineStore("general", {
  state: (): IState => ({
    theme: THEME_DARK,
    loadingState: LoadingState.Idle,
  }),

  getters: {},

  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },

    setLoadingState(state: LoadingState) {
      this.loadingState = state;
    },
  },
});
