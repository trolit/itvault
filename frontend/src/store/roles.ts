import axios from "axios";
import cloneDeep from "lodash/cloneDeep";
import { defineStore } from "pinia";

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
    includesNewRoleTab: state => !!state.tabs.find(tab => tab.roleId === 0),
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

      return data;
    },

    async update(id: number, payload: AddEditRoleDto) {
      const params = {
        version: 1,
      };

      await axios.put<void>(`v1/roles/${id}`, payload, {
        params,
      });

      const tab = this.tabs.find(tab => tab.roleId === id);

      if (tab) {
        tab.initialForm = {
          name: tab.currentForm.name,
          permissions: cloneDeep(tab.currentForm.permissions),
        };

        return;
      }
    },

    addEmptyTab() {
      this.tabs.push({
        roleId: 0,
        currentForm: {
          name: "New Role",
          permissions: [],
        },
        initialForm: {
          name: "New Role",
          permissions: [],
        },
      });

      this.activeRoleId = 0;
    },

    promoteCreateRoleTabToEditRoleTab(id: number) {
      const tab = this.tabs.find(tab => tab.roleId === 0);

      if (tab) {
        tab.roleId = id;

        tab.initialForm = {
          name: tab.currentForm.name,
          permissions: cloneDeep(tab.currentForm.permissions),
        };
      }

      if (this.activeRoleId === 0) {
        this.activeRoleId = id;
      }
    },

    setActiveTab(role: IRoleDto) {
      const tab = this.tabs.find(tab => tab.roleId === role.id);

      this.activeRoleId = role.id;

      if (tab) {
        return;
      }

      this.tabs.push({
        roleId: role.id,
        currentForm: {
          name: role.name,
          permissions: [],
        },
        initialForm: {
          name: role.name,
          permissions: [],
        },
      });
    },

    updateTabCurrentFormName(id: number, name: string) {
      const tab = this.tabs.find(tab => tab.roleId === id);

      if (!tab) {
        return;
      }

      tab.currentForm.name = name;
    },

    updateTabCurrentFormPermissions(
      id: number,
      permissions: IRolePermissionDto[]
    ) {
      const tab = this.tabs.find(tab => tab.roleId === id);

      if (!tab) {
        return;
      }

      tab.currentForm.permissions = permissions;
    },

    setTabPermissions(
      id: number,
      permissions: IRolePermissionDto[] | IPermissionDto[]
    ) {
      const tab = this.tabs.find(tab => tab.roleId === id);

      if (!tab) {
        return;
      }

      const mappedPermissions = permissions.map(permission => ({
        enabled: false,
        ...permission,
      }));

      tab.currentForm.permissions = cloneDeep(mappedPermissions);
      tab.initialForm.permissions = cloneDeep(mappedPermissions);
    },

    closeTab(id: number) {
      const tabIndex = this.tabs.findIndex(tab => tab.roleId === id);

      if (~tabIndex) {
        this.tabs.splice(tabIndex, 1);

        this.activeRoleId = this.tabs.length ? this.tabs[0].roleId : 0;
      }
    },
  },
});
