import { defineStore } from "pinia";
import { THEME_DARK } from "@/assets/constants/themes";

interface IState {
  theme: string;
}

export const usePreferencesStore = defineStore("preferences", {
  state: (): IState => ({
    theme: THEME_DARK,
  }),

  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },
  },
});
