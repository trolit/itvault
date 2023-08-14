import { defineStore } from "pinia";

import type { INoteDto } from "@shared/types/dtos/INoteDto";
import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";

interface IState {
  ROOT: string;

  activeTabId: number;

  tabs: {
    file: IFileDto;
    notes: INoteDto[];
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

    getActiveVariantTab() {
      const tab = this.getActiveTab();

      if (!tab) {
        return;
      }

      return tab.variants.find(
        variant => variant.value.id === tab.activeVariantId
      );
    },

    setActiveTab(file: IFileDto) {
      const tab = this.tabs.find(tab => tab.file.id === file.id);

      this.activeTabId = file.id;

      if (tab) {
        return;
      }

      this.tabs.push({ file, variants: [], notes: [], activeVariantId: "" });
    },

    closeTab(id: number) {
      const tabIndex = this.tabs.findIndex(tab => tab.file.id === id);

      if (~tabIndex) {
        this.tabs.splice(tabIndex, 1);

        if (this.tabs.length) {
          this.activeTabId = this.tabs[0].file.id;
        }
      }
    },
  },
});
