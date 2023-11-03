import axios from "axios";
import { defineStore } from "pinia";

import type { RoleTab } from "@/types/RoleTab";
import type { IRoleDto } from "@shared/types/dtos/IRoleDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  total: number;
  tabs: RoleTab[];
  activeRoleId: number;
}

export const useRolesStore = defineStore("roles", {
  state: (): IState => ({
    total: 0,
    tabs: [],
    activeRoleId: 0,
  }),

  getters: {
    includesAnyTab: state => !!state.tabs.length,
    includesEmptyTab: state => !!state.tabs.find(tab => tab.role.id === 0),
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

      this.total = data.total;

      return data;
    },

    addEmptyTab() {
      this.tabs.push({
        role: {
          id: 0,
          name: "Role 1",
        },
        permissions: [],
      });
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
