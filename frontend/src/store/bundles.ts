import { defineStore } from "pinia";

import { useFilesStore } from "./files";
import type { IBundleDto } from "@shared/types/dtos/IBundleDto";

interface IState {
  activeItem: IBundleDto | null;
}

export const useBundlesStore = defineStore("bundles", {
  state: (): IState => ({
    activeItem: null,
  }),

  actions: {
    setActiveItem(activeItem: IBundleDto) {
      this.activeItem = activeItem;

      const filesStore = useFilesStore();

      filesStore.activeItem = null;
    },
  },
});
