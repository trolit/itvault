import axios from "axios";
import { defineStore } from "pinia";

import { useWorkspacesStore } from "./workspaces";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";

interface IState {
  total: number;
  items: IBlueprintDto[];
}

export const useBlueprintsStore = defineStore("blueprints", {
  state: (): IState => ({
    total: 0,
    items: [],
  }),

  actions: {
    async getAllInfiniteScroll(options: { page: number }) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        perPage: 15,
        workspaceId: workspacesStore.activeItem.id,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<IBlueprintDto>>(
        "v1/blueprints",
        {
          params,
        }
      );

      const { total, result } = data;

      this.items = Array.prototype.concat(this.items, result);

      this.total = total;

      return data;
    },

    // @TODO add option to find blueprints that have at least 1 file
    async getAll(options: IPaginationQuery) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<IBlueprintDto>>(
        "v1/blueprints",
        {
          params,
        }
      );

      return data;
    },
  },
});
