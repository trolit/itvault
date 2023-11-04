import axios from "axios";
import cloneDeep from "lodash/cloneDeep";
import { defineStore } from "pinia";
import orderBy from "lodash/orderBy";

import type { RoleTab } from "@/types/RoleTab";
import type { IRoleDto } from "@shared/types/dtos/IRoleDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { AddEditRoleDto } from "@shared/types/dtos/AddEditRoleDto";
import type { IPermissionDto } from "@shared/types/dtos/IPermissionDto";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";
import type { IRolePermissionDto } from "@shared/types/dtos/IRolePermissionDto";

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
    activeTab(): RoleTab | undefined {
      return this.tabs.find(tab => tab.role.id === this.activeRoleId);
    },
    isActiveTabNewRole: state => state.activeRoleId === 0,
    activeTabGroupedPermissions(): IRolePermissionDto[][] {
      const tab = this.tabs.find(tab => tab.role.id === this.activeRoleId);

      if (!tab) {
        return [];
      }

      const { permissions } = tab;

      const groups = [...new Set(permissions.map(({ group }) => group))].sort();

      return groups.map(group => {
        const data = permissions.filter(
          permission => permission.group === group
        );

        return orderBy(data, element => element.name, ["asc"]);
      });
    },
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

    async getPermissionsById(id: number) {
      const params = {
        version: 1,
      };

      const { data } = await axios.get<IRolePermissionDto[]>(
        `v1/roles/${id}/permissions`,
        {
          params,
        }
      );

      return data;
    },

    async store(payload: AddEditRoleDto) {
      const params = {
        version: 1,
      };

      const { data } = await axios.post<IRoleDto>("v1/roles", payload, {
        params,
      });

      const tab = this.tabs.find(tab => tab.role.id === 0);

      if (tab) {
        tab.role = data;

        tab.initialPermissions = cloneDeep(tab.permissions);
      }

      return data;
    },

    async update(id: number, payload: AddEditRoleDto) {
      const params = {
        version: 1,
      };

      await axios.put<void>(`v1/roles/${id}`, payload, {
        params,
      });

      const tab = this.tabs.find(tab => tab.role.id === id);

      if (tab) {
        tab.role.name = payload.name;

        tab.initialPermissions = cloneDeep(tab.permissions);

        return;
      }
    },

    addEmptyTab() {
      this.tabs.push({
        role: {
          id: 0,
          name: "Role 1",
        },
        permissions: [],
        initialPermissions: [],
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
        initialPermissions: [],
      });
    },

    setTabPermissions(
      id: number,
      permissions: IRolePermissionDto[] | IPermissionDto[]
    ) {
      const tab = this.tabs.find(tab => tab.role.id === id);

      if (!tab) {
        return;
      }

      const mappedPermissions = permissions.map(permission => ({
        enabled: false,
        ...permission,
      }));

      tab.permissions = cloneDeep(mappedPermissions);
      tab.initialPermissions = cloneDeep(mappedPermissions);
    },

    toggleTabPermission(id: number, signature: string) {
      const tab = this.tabs.find(tab => tab.role.id === id);

      if (!tab) {
        return;
      }

      const permission = tab.permissions.find(
        permission => permission.signature === signature
      );

      if (permission) {
        permission.enabled = !permission.enabled;
      }
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
