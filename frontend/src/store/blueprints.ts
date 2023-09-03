import axios from "axios";
import { defineStore } from "pinia";

import { useWorkspacesStore } from "./workspaces";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";
import type { AddEditBlueprintDto } from "@shared/types/dtos/AddEditBlueprintDto";

interface IState {
  total: number;
  items: IBlueprintDto[];
  itemToEdit: IBlueprintDto | null;
}

export const useBlueprintsStore = defineStore("blueprints", {
  state: (): IState => ({
    total: 0,
    items: [],
    itemToEdit: null,
  }),

  getters: {
    BLUEPRINTS_TAB_ITEMS_PER_PAGE: () => 13,
  },

  actions: {
    // @TODO add option to find blueprints that have at least 1 file
    async getAll(options: IPaginationQuery & { inUse?: number }) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<IBlueprintDto>>(
        "v1/blueprints",
        {
          params,
        }
      );

      const { total, result } = data;

      this.items = result;

      this.total = total;

      return data;
    },

    async store(payload: AddEditBlueprintDto) {
      const workspacesStore = useWorkspacesStore();

      return axios.post<IBlueprintDto>("v1/blueprints", payload, {
        params: { version: 1, workspaceId: workspacesStore.activeItem.id },
      });
    },

    async update(payload: AddEditBlueprintDto) {
      if (!this.itemToEdit || this.itemToEdit.id) {
        return;
      }

      const id = this.itemToEdit.id;

      const workspacesStore = useWorkspacesStore();

      await axios.put(`v1/blueprints/${id}`, payload, {
        params: { version: 1, workspaceId: workspacesStore.activeItem.id },
      });

      const updatedBlueprintIndex = this.items.findIndex(
        item => item.id === id
      );

      if (~updatedBlueprintIndex) {
        const updatedAt = new Date().toISOString();

        this.items.splice(updatedBlueprintIndex, 1, {
          ...this.itemToEdit,
          ...payload,
          updatedAt,
        });
      }
    },

    resetState() {
      this.total = 0;
      this.items = [];
    },
  },
});
