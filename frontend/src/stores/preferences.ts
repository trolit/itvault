import { defineStore } from "pinia";
import { THEME_DARK_DIMMED } from "@/assets/constants/themes";

interface State {
  theme: string;
}

export const usePreferencesStore = defineStore("preferences", {
  state: (): State => ({
    theme: THEME_DARK_DIMMED,
  }),

  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },
  },
});
