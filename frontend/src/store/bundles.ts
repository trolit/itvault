import axios from "axios";
import { defineStore } from "pinia";

import { Drawer } from "@/types/Drawer";
import { useDrawerStore } from "./drawer";
import type { Bundle } from "@/types/Bundle";
import { useWorkspacesStore } from "./workspaces";
import type { IBundleDto } from "@shared/types/dtos/IBundleDto";
import type { AddBundleDto } from "@shared/types/dtos/AddBundleDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { IBundleFileDto } from "@shared/types/dtos/IBundleFileDto";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";
import type { IBundleBlueprintDto } from "@shared/types/dtos/IBundleBlueprintDto";

interface IState {
  total: number;
  items: Bundle[];
  activeItemId: number;
}

export const useBundlesStore = defineStore("bundles", {
  state: (): IState => ({
    total: 0,
    items: [],
    activeItemId: 0,
  }),

  getters: {
    activeBundle: state =>
      state.items.find(item => item.id === state.activeItemId),
  },

  actions: {
    async getAll(options: IPaginationQuery) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
        ...options,
      };

      const { data } = await axios.get<PaginatedResponse<IBundleDto>>(
        "v1/bundles",
        {
          params,
        }
      );

      this.items = data.result.map(element => ({
        ...element,
        blueprints: [],
        files: [],
      }));

      this.total = data.total;

      return data;
    },

    showDetailsDrawer(id: number) {
      const drawerStore = useDrawerStore();

      this.activeItemId = id;

      drawerStore.setActiveDrawer(Drawer.Bundle);
    },

    async getBlueprints() {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
      };

      const { data } = await axios.get<IBundleBlueprintDto[]>(
        `v1/bundles/${this.activeItemId}/blueprints`,
        {
          params,
        }
      );

      if (this.activeBundle) {
        this.activeBundle.blueprints = data.map(element => ({
          ...element,
          files: [],
        }));
      }

      return data;
    },

    async getFiles(blueprintId: number) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        blueprintId,
        workspaceId: workspacesStore.activeItem.id,
      };

      const { data } = await axios.get<IBundleFileDto[]>(
        `v1/bundles/${this.activeItemId}/files`,
        {
          params,
        }
      );

      if (!this.activeBundle) {
        return data;
      }

      const blueprint = this.activeBundle.blueprints.find(
        blueprint => blueprint.id === blueprintId
      );

      if (blueprint) {
        blueprint.files = data;
      }

      return data;
    },

    requeue(id: number) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
      };

      return axios.post(`v1/bundles/${id}/requeue`, {
        params,
      });
    },

    async store(payload: AddBundleDto) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
      };

      const { data } = await axios.post<IBundleDto>(`v1/bundles`, payload, {
        params,
      });

      this.items.unshift({ ...data, blueprints: [] });

      return data;
    },

    async download(id: number) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
      };

      const { data } = await axios.get<string>(`v1/bundles/${id}`, {
        params,
        responseType: "arraybuffer",
      });

      return data;
    },
  },
});
