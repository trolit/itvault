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
    async getAll(options: IPaginationQuery & { resource: string }) {
      const filesStore = useFilesStore();

      const tab = filesStore.getActiveTab();

      if (!tab || tab.notes.values.length) {
        return;
      }

      const params = {
        version: 1,
        id: tab?.file?.id,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<INoteDto>>(
        "v1/notes",
        {
          params,
        }
      );

      tab.notes = { values: data.result, total: data.total };

      return data;
    },
  },
});
