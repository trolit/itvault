import axios from "axios";
import { defineStore } from "pinia";

import { useFilesStore } from "./files";
import { useWorkspacesStore } from "./workspaces";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";

interface IState {
  items: IVariantDto[];

  activeItem: IVariantDto | null;
}

export const useVariantsStore = defineStore("variants", {
  state: (): IState => ({
    items: [],
    activeItem: null,
  }),

  actions: {
    async getAll() {
      const filesStore = useFilesStore();
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        fileId: filesStore?.activeItem?.id,
        workspaceId: workspacesStore?.activeItem?.id,
      };

      const { data } = await axios.get<IVariantDto[]>("v1/variants", {
        params,
      });

      this.items = data;

      return data;
    },

    setActiveItem(id: string) {
      if (this?.activeItem?.id === id) {
        return;
      }

      const item = this.items.find(item => item.id === id);

      if (item) {
        this.activeItem = item;
      }
    },
  },
});
