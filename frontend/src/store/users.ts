import axios from "axios";
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import type {
  IUserDTO,
  ISignUpDTO,
  IUpdateUserDTO,
  IPatchUserToWorkspaceDTO,
} from "@shared/types/DTOs/User";
import type { INoteDTO } from "@shared/types/DTOs/Note";
import type { IAddUserDTO } from "@shared/types/DTOs/User";
import type { IWorkspaceDTO } from "@shared/types/DTOs/Workspace";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  total: number;
  items: IUserDTO[];
  itemsToUpdate: IUpdateUserDTO[];
  notes: PaginatedResponse<INoteDTO>;
}

export const useUsersStore = defineStore("users", {
  state: (): IState => ({
    total: 0,
    items: [],
    itemsToUpdate: [],
    notes: { total: 0, result: [] },
  }),

  actions: {
    async getAll(
      query: IPaginationQuery & { filters?: { workspaceId?: number } },
      options = { keepInStore: true }
    ) {
      const { page, perPage, filters } = query;

      const params = {
        version: 1,
        page,
        perPage,
        filters: JSON.stringify(filters),
      };

      const { data } = await axios.get<PaginatedResponse<IUserDTO>>(
        `v1/users`,
        { params }
      );

      if (options.keepInStore) {
        this.items = data.result;
        this.total = data.total;
      }

      return data;
    },

    async getNotes(page: number, userId: number) {
      if (page === 1) {
        this.notes = { total: 0, result: [] };
      }

      const { data } = await axios.get<PaginatedResponse<INoteDTO>>(
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

    async add(payload: IAddUserDTO) {
      return axios.post<IUserDTO>("v1/users", payload, {
        params: { version: 1 },
      });
    },

    async patchWorkspacesAccessibleByUser(
      userId: number,
      workspaces: IWorkspaceDTO[]
    ) {
      const payload: IPatchUserToWorkspaceDTO = {
        ids: workspaces.map(workspace => workspace.id),
      };

      return axios.patch(`v1/users/${userId}/workspaces`, payload, {
        params: { version: 1 },
      });
    },

    async signUp(payload: ISignUpDTO) {
      return axios.post(`v1/users/sign-up`, payload, {
        params: { version: 1 },
      });
    },

    async updateMany() {
      const params = {
        version: 1,
      };

      await axios.patch(
        "v1/users",
        {
          values: this.itemsToUpdate,
        },
        { params }
      );

      this.itemsToUpdate.map(itemToUpdate => {
        const item = this.items.find(item => item.id === itemToUpdate.id);

        if (!item) {
          return;
        }

        const { data } = itemToUpdate;

        if (typeof data.isActive === "boolean") {
          item.isActive = data.isActive;
        }

        if (data.roleId) {
          item.roleId = data.roleId;
        }
      });

      this.itemsToUpdate = [];
    },

    findItemToUpdate(id: number) {
      return this.itemsToUpdate.find(itemToUpdate => itemToUpdate.id === id);
    },

    removeDataKey(key: "roleId" | "isActive", item: IUpdateUserDTO) {
      delete item.data[key];

      if (!Object.keys(item.data).length) {
        const index = this.itemsToUpdate.indexOf(item);

        this.itemsToUpdate.splice(index, 1);
      }
    },

    findItemToUpdateRoleId(id: number) {
      const itemToUpdate = this.findItemToUpdate(id);

      if (!itemToUpdate || !itemToUpdate.data.roleId) {
        return null;
      }

      return itemToUpdate.data.roleId;
    },

    findItemToUpdateIsActive(id: number) {
      const itemToUpdate = this.findItemToUpdate(id);

      if (!itemToUpdate || typeof itemToUpdate.data.isActive !== "boolean") {
        return null;
      }

      return itemToUpdate.data.isActive;
    },

    setRole(userId: number, roleId: number) {
      const originalItem = this.items.find(item => item.id === userId);

      const item = this.findItemToUpdate(userId);

      if (
        item &&
        originalItem &&
        originalItem.id === item.id &&
        roleId === originalItem.roleId
      ) {
        this.removeDataKey("roleId", item);

        return;
      }

      if (!item) {
        this.itemsToUpdate.push({
          id: userId,
          data: {
            roleId,
          },
        });

        return;
      }

      item.data.roleId = roleId;
    },

    setIsActive(userId: number, status: boolean) {
      const originalItem = this.items.find(item => item.id === userId);

      const item = this.findItemToUpdate(userId);

      if (
        item &&
        originalItem &&
        originalItem.id === item.id &&
        status === originalItem.isActive
      ) {
        this.removeDataKey("isActive", item);

        return;
      }

      if (!item) {
        this.itemsToUpdate.push({
          id: userId,
          data: {
            isActive: status,
          },
        });

        return;
      }

      item.data.isActive = status;
    },
  },
});
