import axios from "axios";
import { defineStore } from "pinia";

import { useFilesStore } from "./files";
import { useWorkspacesStore } from "./workspaces";
import type { INoteDTO } from "@shared/types/DTOs/Note";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {}

export const useNotesStore = defineStore("notes", {
  state: (): IState => ({}),

  actions: {
    async getAll(options: IPaginationQuery) {
      const filesStore = useFilesStore();
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const { activeTab, activeFileId } = filesStore;

      if (!activeTab) {
        return;
      }

      const params = {
        version: 1,
        workspaceId,
        fileId: activeFileId,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<INoteDTO>>(
        "v1/notes",
        {
          params,
        }
      );

      activeTab.notes.total = data.total;
      activeTab.notes.data = data.result;

      return data;
    },

    async add(text: string, fileId: number) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      const payload = {
        text,
        fileId,
      };

      const { data: item } = await axios.post<INoteDTO>(`v1/notes`, payload, {
        params,
      });

      return item;
    },

    update(id: number, text: string) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      const payload = {
        text,
      };

      return axios.patch(`v1/notes/${id}/value`, payload, {
        params,
      });
    },

    async delete(id: number) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      await axios.delete(`v1/notes/${id}`, { params });
    },

    // @TMP -> use Engine.IO
    _removeFileNote(id: number) {
      const filesStore = useFilesStore();

      const fileTab = filesStore.findTabById(id);

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
