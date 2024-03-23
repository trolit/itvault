import { defineStore } from "pinia";

import type { Drawer } from "@/types/enums/Drawer";

interface IState {
  activeDrawer: Drawer | null;
}

export const useDrawerStore = defineStore("drawer", {
  state: (): IState => ({
    activeDrawer: null,
  }),

  actions: {
    isDrawerActive(drawer: Drawer) {
      return this.activeDrawer && this.activeDrawer === drawer;
    },

    setActiveDrawer(drawer: Drawer | null) {
      if (drawer === this.activeDrawer) {
        this.activeDrawer = null;

        return;
      }

      this.activeDrawer = drawer;
    },
  },
});
