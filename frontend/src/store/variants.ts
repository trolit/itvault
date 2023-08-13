import axios from "axios";
import { defineStore } from "pinia";

import { useFilesStore } from "./files";
import { useWorkspacesStore } from "./workspaces";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";

interface IState {
  items: IVariantDto[];

  // @DEPRECATED
  variantTabs: { instance: IVariantDto; content: string }[];
}

export const useVariantsStore = defineStore("variants", {
  state: (): IState => ({
    items: [],
    variantTabs: [],
  }),

  actions: {
    async getAll() {
      const filesStore = useFilesStore();
      const workspacesStore = useWorkspacesStore();

      const tab = filesStore.getActiveTab();

      const params = {
        version: 1,
        fileId: tab?.file?.id,
        workspaceId: workspacesStore?.activeItem?.id,
      };

      const { data } = await axios.get<IVariantDto[]>("v1/variants", {
        params,
      });

      this.items = data;

      return data;
    },

    newVariantTab(id: string) {
      const tab = this.variantTabs.find(tab => tab.instance.id === id);

      if (tab) {
        return;
      }

      const instance = this.items.find(item => item.id === id);

      if (instance) {
        this.variantTabs.push({ instance, content: "" });
      }
    },

    closeVariantTab(id: string) {
      const tabIndex = this.variantTabs.findIndex(
        tab => tab.instance.id === id
      );

      if (~tabIndex) {
        this.variantTabs.splice(tabIndex, 1);
      }
    },
  },
});
