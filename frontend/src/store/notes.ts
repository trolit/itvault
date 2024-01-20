import axios from "axios";
import { defineStore } from "pinia";

import { useFilesStore } from "./files";
import type { INoteDTO } from "@shared/types/DTOs/Note";
import { NoteResource } from "@shared/types/enums/NoteResource";
import type { ResourceDTO } from "@shared/types/DTOs/ResourceDTO";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {}

export const useNotesStore = defineStore("notes", {
  state: (): IState => ({}),

  actions: {
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

    async add(text: string, resource: ResourceDTO) {
      const params = {
        version: 1,
      };

      const payload = {
        text,
        resource,
      };

      const { data: item } = await axios.post<INoteDTO>(`v1/notes`, payload, {
        params,
      });

      return item;
    },

    updateText(id: number, text: string) {
      const params = {
        version: 1,
      };

      const payload = {
        text,
      };

      return axios.patch(`v1/notes/${id}/value`, payload, {
        params,
      });
    },

    async delete(id: number, resource: ResourceDTO) {
      const params = {
        version: 1,
      };

      await axios.delete(`v1/notes/${id}`, { params });

      if (resource.name === NoteResource.File) {
        this._removeFileNote(<number>resource.id);
      }
    },

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
