import axios from "axios";
import { defineStore } from "pinia";

import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  total: number;

  items: IBlueprintDto[];
}

export const useBlueprintsStore = defineStore("blueprint", {
  state: (): IState => ({
    total: 0,
    items: [],
  }),

  actions: {
    async getAll(options: IPaginationQuery & { workspaceId: number }) {
      const params = {
        version: 1,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<IBlueprintDto>>(
        "v1/blueprints",
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
