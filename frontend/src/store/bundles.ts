import axios from "axios";
import { defineStore } from "pinia";

import { Drawer } from "@/types/Drawer";
import { useDrawerStore } from "./drawer";
import { useWorkspacesStore } from "./workspaces";
import type { IBundleDto } from "@shared/types/dtos/IBundleDto";
import type { IBundleFileDto } from "@shared/types/dtos/IBundleFileDto";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";
import type { IBundleBlueprintDto } from "@shared/types/dtos/IBundleBlueprintDto";

interface IState {
  total: number;
  items: (IBundleDto & {
    blueprints: IBundleBlueprintDto[];
    files: IBundleFileDto[];
  })[];
  activeItemId: number;
}

export const useBundlesStore = defineStore("bundles", {
  state: (): IState => ({
    total: 0,
    items: [],
    activeItemId: 0,
  }),

  getters: {
    activeBundle: state =>
      state.items.find(item => item.id === state.activeItemId),
  },

  actions: {
    async getAll(options: { page: number }) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        perPage: 10,
        workspaceId: workspacesStore.activeItem.id,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<IBundleDto>>(
        "v1/bundles",
        {
          params,
        }
      );

      this.items = data.result.map(element => ({
        ...element,
        blueprints: [],
        files: [],
      }));

      this.total = data.total;

      return data;
    },

    showDetailsDrawer(id: number) {
      const drawerStore = useDrawerStore();

      this.activeItemId = id;

      drawerStore.setActiveDrawer(Drawer.Bundle);
    },
  },
});
