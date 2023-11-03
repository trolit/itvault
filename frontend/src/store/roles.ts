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

  getters: {
    hasAnyTab: state => !!state.tabs.length,
  },

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

    setActiveTab(role: IRoleDto) {
      const tab = this.tabs.find(tab => tab.role.id === role.id);

      this.activeRoleId = role.id;

      if (tab) {
        return;
      }

      this.tabs.push({
        role,
        permissions: [],
      });
    },

    closeTab(id: number) {
      const tabIndex = this.tabs.findIndex(tab => tab.role.id === id);

      if (~tabIndex) {
        this.tabs.splice(tabIndex, 1);

        this.activeRoleId = this.tabs.length ? this.tabs[0].role.id : 0;
      }
    },
  },
});
