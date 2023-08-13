import { defineStore } from "pinia";

import { useBundlesStore } from "./bundles";
import type { IFileDto } from "@shared/types/dtos/IFileDto";

interface IState {
  ROOT: string;

  activeItem: IFileDto | null;
}

export const useFilesStore = defineStore("files", {
  state: (): IState => ({
    ROOT: ".",
    activeItem: null,
  }),

  actions: {
    setActiveItem(activeItem: IFileDto) {
      this.activeItem = activeItem;

      const bundlesStore = useBundlesStore();

      bundlesStore.activeItem = null;
    },
  },
});
