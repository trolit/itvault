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

    async store(text: string, resource: string, fileId: number) {
      const params = {
        version: 1,
      };

      const payload = {
        text,
        resource: {
          id: fileId,
          name: resource,
        },
      };

      const { data: item } = await axios.post<INoteDto>(`v1/notes`, payload, {
        params,
      });

      return item;
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
        version: 1,
      };

      await axios.delete(`v1/notes/${id}`, { params });

      const workspacesStore = useWorkspacesStore();

      // @TODO create function to get tab by file id
      const fileTab = workspacesStore.tabs.find(tab => tab.file.id === fileId);

      if (!fileTab) {
        return;
      }

      const note = fileTab.notes.data.find(note => note.id === id);

      if (note) {
        note.isDeleted = true;
      }
    },
  },
});
