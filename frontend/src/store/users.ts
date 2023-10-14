import axios from "axios";
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import type { INoteDto } from "@shared/types/dtos/INoteDto";
import type { IUserDto } from "@shared/types/dtos/IUserDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  total: number;
  items: IUserDto[];
  notes: PaginatedResponse<INoteDto>;
}

export const useUsersStore = defineStore("users", {
  state: (): IState => ({
    total: 0,
    items: [],
    notes: { total: 0, result: [] },
  }),

  actions: {
    async getAll(options: IPaginationQuery) {
      const params = {
        version: 1,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<IUserDto>>(
        `v1/users`,
        { params }
      );

      this.items = data.result;

      this.total = data.total;

      return data;
    },

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
