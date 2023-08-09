import axios from "axios";
import { defineStore } from "pinia";

import type { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  workspaces: PaginatedResponse<IWorkspaceDto>;
}

export const useWorkspacesStore = defineStore("workspace", {
  state: (): IState => ({
    workspaces: { result: [], total: -1 },
  }),

  actions: {
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

      this.workspaces = data;

      return data;
    },
  },
});
