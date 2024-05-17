import axios from "axios";
import cloneDeep from "lodash/cloneDeep";
import { defineStore } from "pinia";

import type {
  IRoleDTO,
  IAddEditRoleDTO,
  IRolePermissionDTO,
} from "@shared/types/DTOs/Role";
import type { RoleTab } from "@/types/RoleTab";
import type { IPermissionDTO } from "@shared/types/DTOs/Permission";
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
    isAddLimitReached: state => state.total > 20,
    includesAnyTab: state => !!state.tabs.length,
    includesNewRoleTab: state => !!state.tabs.find(tab => tab.roleId === 0),
  },

  actions: {
    async getAll(options: IPaginationQuery & { name?: string }) {
      const params = {
        version: 1,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<IRoleDTO>>(
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

      const { data } = await axios.get<IRolePermissionDTO[]>(
        `v1/roles/${id}/permissions`,
        {
          params,
        }
      );

      return data;
    },

    async add(payload: IAddEditRoleDTO) {
      const params = {
        version: 1,
      };

      const { data } = await axios.post<IRoleDTO>("v1/roles", payload, {
        params,
      });

      return data;
    },

    async update(id: number, payload: IAddEditRoleDTO) {
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
          description: tab.currentForm.description,
          permissions: cloneDeep(tab.currentForm.permissions),
        };
      }
    },

    addEmptyTab() {
      this.tabs.push({
        roleId: 0,
        currentForm: {
          name: "[New Role]",
          description: "",
          permissions: [],
        },
        initialForm: {
          name: "[New Role]",
          description: "",
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
          description: tab.currentForm.description,
          permissions: cloneDeep(tab.currentForm.permissions),
        };
      }

      if (this.activeRoleId === 0) {
        this.activeRoleId = id;
      }
    },

    setActiveTab(role: IRoleDTO) {
      const tab = this.tabs.find(tab => tab.roleId === role.id);

      this.activeRoleId = role.id;

      if (tab) {
        return;
      }

      this.tabs.push({
        roleId: role.id,
        currentForm: {
          name: role.name,
          description: role.description,
          permissions: [],
        },
        initialForm: {
          name: role.name,
          description: role.description,
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
      permissions: IRolePermissionDTO[]
    ) {
      const tab = this.tabs.find(tab => tab.roleId === id);

      if (!tab) {
        return;
      }

      tab.currentForm.permissions = permissions;
    },

    updateTabCurrentFormDescription(id: number, description: string) {
      const tab = this.tabs.find(tab => tab.roleId === id);

      if (!tab) {
        return;
      }

      tab.currentForm.description = description;
    },

    setTabPermissions(
      id: number,
      permissions: IRolePermissionDTO[] | IPermissionDTO[]
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
