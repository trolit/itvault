import { defineStore } from "pinia";
import { DARK_THEME, LIGHT_THEME } from "@/assets/constants/themes";

interface State {
  theme: string;
}

export const usePreferencesStore = defineStore("preferences", {
  state: (): State => ({
    theme: DARK_THEME,
  }),

  actions: {
    toggleTheme() {
      this.theme = this.theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    },
  },
});
