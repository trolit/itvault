import { defineStore } from "pinia";

import { THEME_DARK } from "@/assets/constants/themes";
import { LoadingState } from "@/types/enums/LoadingState";
import type { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";

interface IState {
  theme: string;
  loadingState: LoadingState;
  message: MessageApiInjection | null;
}

export const useGeneralStore = defineStore("general", {
  state: (): IState => ({
    message: null,
    theme: THEME_DARK,
    loadingState: LoadingState.Idle,
  }),

  getters: {
    messageProvider(): MessageApiInjection {
      if (!this.message) {
        throw Error("Message service not defined!");
      }

      return this.message;
    },
  },

  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },

    setLoadingState(state: LoadingState) {
      this.loadingState = state;
    },

    setMessageProvider(message: MessageApiInjection) {
      this.message = message;
    },
  },
});
