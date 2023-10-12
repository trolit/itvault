import axios from "axios";
import { defineStore } from "pinia";

import { useFilesStore } from "./files";
import type { INoteDto } from "@shared/types/dtos/INoteDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {}

export const useNotesStore = defineStore("notes", {
  state: (): IState => ({}),

  actions: {
    // @TODO make shared ResourceDto type that includes { name, id }
    async getAll(options: IPaginationQuery & { resource: string }) {
      const filesStore = useFilesStore();

      const { activeTab, activeFileId } = filesStore;

      if (!activeTab) {
        return;
      }

      const params = {
        version: 1,
        id: activeFileId,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<INoteDto>>(
        "v1/notes",
        {
          params,
        }
      );

      activeTab.notes.total = data.total;
      activeTab.notes.data = data.result;

      return data;
    },

    async store(text: string, resource: string, id: number) {
      const params = {
        version: 1,
      };

      const payload = {
        text,
        resource: {
          id,
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

    // @TODO require resource name to know what action to take after note delete
    async delete(id: number, fileId: number) {
      const params = {
        version: 1,
      };

      await axios.delete(`v1/notes/${id}`, { params });

      const filesStore = useFilesStore();

      const fileTab = filesStore.findTabById(fileId);

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
