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

      const fileTab = workspaceStore.activeFileTab;

      if (!fileTab) {
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

      fileTab.notes.total = data.total;
      fileTab.notes.data = data.result;

      return data;
    },

    update(id: number, text: string) {
      const params = {
        id,
        version: 1,
      };

      const payload = {
        text,
      };

      return axios.put(`v1/notes/${id}`, payload, {
        params,
      });
    },

    delete(id: number) {
      const params = {
        id,
        version: 1,
      };

      return axios.delete(`v1/notes/${id}`, { params });
    },
  },
});
