import axios from "axios";
import { defineStore } from "pinia";

import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";
import type { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  total: number;

  items: IWorkspaceDto[];

  activeItem: IWorkspaceDto;

  tree: (IDirectoryDto & IFileDto)[];
}

export const useWorkspacesStore = defineStore("workspace", {
  state: (): IState => ({
    tree: [],
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

    // @TODO add option to query tree by blueprintId
    async getTree(options: { relativePath: string }) {
      const params = {
        version: 1,
        ...options,
      };

      const { data } = await axios.get<(IFileDto & IDirectoryDto)[]>(
        `v1/workspaces/${this.activeItem.id}/tree`,
        {
          params,
        }
      );

      return data;
    },
  },
});
