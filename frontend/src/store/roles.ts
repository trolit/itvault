import axios from "axios";
import { defineStore } from "pinia";

import type { RoleTab } from "@/types/RoleTab";
import type { IRoleDto } from "@shared/types/dtos/IRoleDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  tabs: RoleTab[];
  activeRoleId: number;
}

export const useRolesStore = defineStore("roles", {
  state: (): IState => ({
    tabs: [],
    activeRoleId: 0,
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

      return data;
    },
  },
});
