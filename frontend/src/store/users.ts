import axios from "axios";
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import type { INoteDto } from "@shared/types/dtos/INoteDto";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  notes: PaginatedResponse<INoteDto>;
}

export const useUsersStore = defineStore("users", {
  state: (): IState => ({
    notes: { total: 0, result: [] },
  }),

  actions: {
    async getNotes(page: number, userId: number) {
      if (page === 1) {
        this.notes = { total: 0, result: [] };
      }

      const { data } = await axios.get<PaginatedResponse<INoteDto>>(
        `v1/users/${userId}/notes`,
        {
          params: { page, version: 1 },
        }
      );

      const { result, total } = data;

      this.notes.result = Array.prototype.concat(
        cloneDeep(this.notes.result),
        result
      );

      this.notes.total = total;
    },
  },
});
