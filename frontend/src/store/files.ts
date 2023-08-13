import { defineStore } from "pinia";

import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";

interface IState {
  ROOT: string;

  activeTabId: number;

  tabs: {
    file: IFileDto;
    activeVariantId: string;
    variants: { value: IVariantDto; content: string; isVisible: boolean }[];
  }[];
}

export const useFilesStore = defineStore("files", {
  state: (): IState => ({
    tabs: [],
    ROOT: ".",
    activeTabId: 0,
  }),

  actions: {
    getActiveTab() {
      return this.tabs.find(tab => tab.file.id === this.activeTabId);
    },

    setActiveTab(file: IFileDto) {
      const tab = this.tabs.find(tab => tab.file.id === file.id);

      this.activeTabId = file.id;

      if (tab) {
        return;
      }

      this.tabs.push({ file, variants: [], activeVariantId: "" });
    },

    closeTab(id: number) {
      const tabIndex = this.tabs.findIndex(tab => tab.file.id === id);

      if (~tabIndex) {
        if (this.tabs[tabIndex].file.id === id) {
          this.activeTabId = 0;
        }

        this.tabs.splice(tabIndex, 1);
      }
    },
  },
});
