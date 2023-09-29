import { defineStore } from "pinia";

import { THEME_DARK } from "@/assets/constants/themes";
import { LoadingState } from "@/types/enums/LoadingState";

interface IState {
  theme: string;
  isSiderCollapsed: boolean;
  loadingState: LoadingState;
}

export const useGeneralStore = defineStore("general", {
  state: (): IState => ({
    theme: THEME_DARK,
    isSiderCollapsed: false,
    loadingState: LoadingState.Idle,
  }),

  getters: {
    TRIGGER_STYLE_TOP: () => "31px",
    TRIGGER_STYLE_HEIGHT: () => "17px",
  },

  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },

    toggleSider() {
      this.isSiderCollapsed = !this.isSiderCollapsed;
    },

    setLoadingState(state: LoadingState) {
      this.loadingState = state;
    },
  },
});
