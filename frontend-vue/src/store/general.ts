import { defineStore } from "pinia";

import { THEME_DARK } from "@/assets/constants/themes";
import { LoadingState } from "@/types/enums/LoadingState";
import type { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";

interface IState {
  theme: string;
  isChatVisible: boolean;
  loadingState: LoadingState;
  message: MessageApiInjection | null;
}

export const useGeneralStore = defineStore("general", {
  state: (): IState => ({
    message: null,
    theme: THEME_DARK,
    isChatVisible: false,
    loadingState: LoadingState.Idle,
  }),

  getters: {
    GLOBAL_CHAT_WIDTH: () => 360,
    messageProvider(): MessageApiInjection {
      if (!this.message) {
        throw Error("Message service not defined!");
      }

      return this.message;
    },
  },

  actions: {
    toggleChat() {
      this.isChatVisible = !this.isChatVisible;
    },

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
