import axios from "axios";
import { defineStore } from "pinia";

import { useGeneralStore } from "./general";
import { useVariantsStore } from "./variants";
import { useWorkspacesStore } from "./workspaces";
import { useDateService } from "@/services/useDateService";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";
import type { IBlueprintDTO, IAddEditBlueprintDTO } from "@shared/types/DTOs/Blueprint";

interface IState {
  total: number;
  items: IBlueprintDTO[];
  itemToEdit: IBlueprintDTO | null;
  pinStatusUpdateItemId: number;
}

export const useBlueprintsStore = defineStore("blueprints", {
  state: (): IState => ({
    total: 0,
    items: [],
    itemToEdit: null,
    pinStatusUpdateItemId: 0,
  }),

  getters: {
    ITEMS_PER_PAGE: () => 13,
    activeItem(): IBlueprintDTO | undefined {
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

      const { data } = await axios.get<PaginatedResponse<IBlueprintDTO>>(
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

    async add(payload: IAddEditBlueprintDTO) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      return axios.post<IBlueprintDTO>("v1/blueprints", payload, {
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

    async update(payload: IAddEditBlueprintDTO) {
      if (!this.itemToEdit?.id) {
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

    async pin(id: number) {
      const dateService = useDateService();
      const generalStore = useGeneralStore();
      const { activeItemId: workspaceId } = useWorkspacesStore();

      if (this.pinStatusUpdateItemId) {
        return;
      }

      this.pinStatusUpdateItemId = id;

      try {
        await axios.post(
          `v1/blueprints/${id}/pin`,
          {},
          { params: { version: 1, workspaceId } }
        );

        const itemIndex = this.items.findIndex(
          blueprint => blueprint.id === id
        );

        if (~itemIndex) {
          this.items[itemIndex].pinnedAt = dateService.now().toISOString();
        }

        generalStore.messageProvider.success(`Blueprint pinned!`);
      } catch (error) {
        console.log(error);

        generalStore.messageProvider.error(`Failed to pin blueprint!`);
      } finally {
        this.pinStatusUpdateItemId = 0;
      }
    },

    async unpin(id: number) {
      const generalStore = useGeneralStore();
      const { activeItemId: workspaceId } = useWorkspacesStore();

      if (this.pinStatusUpdateItemId) {
        return;
      }

      this.pinStatusUpdateItemId = id;

      try {
        axios.post(
          `v1/blueprints/${id}/unpin`,
          {},
          { params: { version: 1, workspaceId } }
        );

        const itemIndex = this.items.findIndex(
          blueprint => blueprint.id === id
        );

        if (~itemIndex) {
          this.items[itemIndex].pinnedAt = null;
        }

        generalStore.messageProvider.success(`Blueprint unpinned!`);
      } catch (error) {
        console.log(error);

        generalStore.messageProvider.error(`Failed to unpin blueprint!`);
      } finally {
        this.pinStatusUpdateItemId = 0;
      }
    },

    resetState() {
      this.total = 0;
      this.items = [];
    },
  },
});
