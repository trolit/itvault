import axios from "axios";
import { defineStore } from "pinia";

import type { INoteDto } from "@shared/types/dtos/INoteDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";
import { useWorkspacesStore } from "./workspaces";

interface IState {}

export const useNotesStore = defineStore("notes", {
  state: (): IState => ({}),

  actions: {
    async getAll(options: IPaginationQuery & { resource: string }) {
      const workspaceStore = useWorkspacesStore();

      const fileTab = workspaceStore.activeFileTabValue;

      if (!fileTab || fileTab.notes.data.length) {
        return;
      }

      const params = {
        version: 1,
        id: workspaceStore.activeFileId,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<INoteDto>>(
        "v1/notes",
        {
          params,
        }
      );

      fileTab.notes = { data: data.result, total: data.total };

      return data;
    },
  },
});
