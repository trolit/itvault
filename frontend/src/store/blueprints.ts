import axios from "axios";
import { defineStore } from "pinia";

import { useVariantsStore } from "./variants";
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
    ITEMS_PER_PAGE: () => 13,
    activeItem(): IBlueprintDto | undefined {
      const { activeTab: activeVariantTab } = useVariantsStore();

      if (!activeVariantTab) {
        return;
      }

      return activeVariantTab.blueprints.find(
        blueprint => blueprint.id === activeVariantTab.activeBlueprintId
      );
    },
  },

  actions: {
    async getAll(
      options: IPaginationQuery & { inUse?: number; name?: string }
    ) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
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
      const { activeItemId: workspaceId } = useWorkspacesStore();

      return axios.post<IBlueprintDto>("v1/blueprints", payload, {
        params: { version: 1, workspaceId },
      });
    },

    async delete(id: number) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      await axios.delete(`v1/blueprints/${id}`, {
        params: { version: 1, workspaceId },
      });

      const blueprintIndex = this.items.findIndex(item => item.id === id);

      if (~blueprintIndex) {
        this.items.splice(blueprintIndex, 1);
      }
    },

    async update(payload: AddEditBlueprintDto) {
      if (!this.itemToEdit || !this.itemToEdit.id) {
        return;
      }

      const { id } = this.itemToEdit;
      const { activeItemId: workspaceId } = useWorkspacesStore();

      await axios.put(`v1/blueprints/${id}`, payload, {
        params: { version: 1, workspaceId },
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
