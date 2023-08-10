import axios from "axios";
import { defineStore } from "pinia";

import type { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  total: number;

  items: IWorkspaceDto[];

  activeItem: IWorkspaceDto;
}

export const useWorkspacesStore = defineStore("workspace", {
  state: (): IState => ({
    total: 0,
    items: [],
    activeItem: { id: 0, name: "", slug: "", tags: [] },
  }),

  actions: {
    setActiveItem(item: IWorkspaceDto) {
      this.activeItem = item;
    },

    async getBySlug(slug: string) {
      const params = {
        version: 1,
      };

      const { data } = await axios.get<IWorkspaceDto>(`v1/workspaces/${slug}`, {
        params,
      });

      this.activeItem = data;

      return data;
    },

    async getAll(query: IPaginationQuery) {
      const params = {
        version: 1,
        ...query,
      };

      const { data } = await axios.get<PaginatedResponse<IWorkspaceDto>>(
        "v1/workspaces",
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
