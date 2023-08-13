import { defineStore } from "pinia";

import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";

interface IState {
  ROOT: string;

  activeTabId: number;

  tabs: {
    file: IFileDto;
    variants: { value: IVariantDto; content: string }[];
  }[];
}

export const useFilesStore = defineStore("files", {
  state: (): IState => ({
    ROOT: ".",
    activeTabId: 0,
    tabs: [],
  }),

  actions: {
    getActiveTab() {
      return this.tabs.find(tab => tab.file.id === this.activeTabId);
    },

    newFileTab(file: IFileDto) {
      const tab = this.tabs.find(tab => tab.file.id === file.id);

      this.activeTabId = file.id;

      if (tab) {
        return;
      }

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
