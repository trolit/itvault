import { defineStore } from "pinia";
import { THEME_DARK_DIMMED } from "@/assets/constants/themes";

interface State {
  theme: string;
  isSidebarCollapsed: boolean;
}

export const usePreferencesStore = defineStore("preferences", {
  state: (): State => ({
    theme: THEME_DARK_DIMMED,
    isSidebarCollapsed: false,
  }),

  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },

    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
  },
});
