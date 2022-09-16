import { defineStore } from "pinia";
import { THEME_DARK } from "@/assets/constants/themes";

interface State {
  theme: string;
}

export const usePreferencesStore = defineStore("preferences", {
  state: (): State => ({
    theme: THEME_DARK,
  }),

  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },
  },
});
