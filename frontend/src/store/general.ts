import { defineStore } from "pinia";
import { useMessage } from "naive-ui";

import { THEME_DARK } from "@/assets/constants/themes";
import { LoadingState } from "@/types/enums/LoadingState";
import type { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";

interface IState {
  theme: string;
  loadingState: LoadingState;
}

export const useGeneralStore = defineStore("general", {
  state: (): IState => ({
    theme: THEME_DARK,
    loadingState: LoadingState.Idle,
  }),

  getters: {
    messageProvider(): MessageApiInjection {
      return useMessage();
    },
  },

  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },

    setLoadingState(state: LoadingState) {
      this.loadingState = state;
    },
  },
});
