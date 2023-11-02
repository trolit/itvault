import axios from "axios";
import { defineStore } from "pinia";

import type { IRoleDto } from "@shared/types/dtos/IRoleDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  total: number;
  items: IRoleDto[];
}

export const useRolesStore = defineStore("roles", {
  state: (): IState => ({
    total: 0,
    items: [],
  }),

  actions: {
    async getAll(options: IPaginationQuery) {
      const params = {
        version: 1,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<IRoleDto>>(
        `v1/roles`,
        { params }
      );

      this.total = data.total;

      return data;
    },
  },
});
