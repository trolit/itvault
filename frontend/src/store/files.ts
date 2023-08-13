import { defineStore } from "pinia";

import { useBundlesStore } from "./bundles";
import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";

interface IState {
  ROOT: string;

  activeItem: IFileDto | null;

  activeTab: number;

  tabs: {
    file: IFileDto;
    variants: { value: IVariantDto; content: string }[];
  }[];
}

export const useFilesStore = defineStore("files", {
  state: (): IState => ({
    ROOT: ".",
    // @DEPRECATED
    activeItem: null,
    activeTab: 0,
    tabs: [],
  }),

  actions: {
    // @DEPRECATED
    setActiveItem(activeItem: IFileDto) {
      this.activeItem = activeItem;

      const bundlesStore = useBundlesStore();

      bundlesStore.activeItem = null;
    },

    getActiveTab() {
      return this.tabs.find(tab => tab.file.id === this.activeTab);
    },

    newFileTab(file: IFileDto) {
      const tab = this.tabs.find(tab => tab.file.id === file.id);

      if (tab) {
        return;
      }

      this.activeTab = file.id;

      this.tabs.push({ file, variants: [] });
    },

    closeFileTab(id: number) {
      const tabIndex = this.tabs.findIndex(tab => tab.file.id === id);

      if (~tabIndex) {
        this.tabs.splice(tabIndex, 1);
      }
    },
  },
});
