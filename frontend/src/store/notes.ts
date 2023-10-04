import axios from "axios";
import { defineStore } from "pinia";

import { useWorkspacesStore } from "./workspaces";
import type { INoteDto } from "@shared/types/dtos/INoteDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

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

    async delete(id: number, fileId: number) {
      const params = {
        id,
        version: 1,
      };

      await axios.delete(`v1/notes/${id}`, { params });

      const workspacesStore = useWorkspacesStore();

      // @TODO create function to get tab by file id
      const fileTab = workspacesStore.tabs.find(tab => tab.file.id === fileId);

      if (!fileTab) {
        return;
      }

      const noteIndex = fileTab.notes.data.findIndex(note => note.id === id);

      if (~noteIndex) {
        fileTab.notes.data.splice(noteIndex, 1);
      }
    },
  },
});
