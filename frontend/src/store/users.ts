import axios from "axios";
import has from "lodash/has";
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import type { INoteDto } from "@shared/types/dtos/INoteDto";
import type { IUserDto } from "@shared/types/dtos/IUserDto";
import type { UpdateUserDto } from "@shared/types/dtos/UpdateUserDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  total: number;
  items: IUserDto[];
  itemsToUpdate: UpdateUserDto[];
  notes: PaginatedResponse<INoteDto>;
}

export const useUsersStore = defineStore("users", {
  state: (): IState => ({
    total: 0,
    items: [],
    itemsToUpdate: [],
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

    findItemToUpdate(id: number) {
      return this.itemsToUpdate.find(itemToUpdate => itemToUpdate.id === id);
    },

    removeDataKey(key: "roleId" | "isActive", item: UpdateUserDto) {
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

      if (!itemToUpdate || !has(itemToUpdate.data, "isActive")) {
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
