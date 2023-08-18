import axios from "axios";
import { defineStore } from "pinia";

import { useWorkspacesStore } from "./workspaces";
import type { IBundleDto } from "@shared/types/dtos/IBundleDto";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  total: number;
  items: IBundleDto[];
  activeItemId: number;
}

export const useBundlesStore = defineStore("bundles", {
  state: (): IState => ({
    total: 0,
    items: [],
    activeItemId: 0,
  }),

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

      this.items = data.result;

      this.total = data.total;

      return data;
    },
  },
});
