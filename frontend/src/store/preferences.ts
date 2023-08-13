import { defineStore } from "pinia";
import { THEME_DARK } from "@/assets/constants/themes";

interface IState {
  theme: string;
  isSiderCollapsed: boolean;
}

export const usePreferencesStore = defineStore("preferences", {
  state: (): IState => ({
    theme: THEME_DARK,
    isSiderCollapsed: false,
  }),

  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },

    toggleSider() {
      this.isSiderCollapsed = !this.isSiderCollapsed;
    },
  },
});
