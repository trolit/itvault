import axios from "axios";
import { defineStore } from "pinia";

import { useDrawerStore } from "./drawer";
import type { Bundle } from "@/types/Bundle";
import { Drawer } from "@/types/enums/Drawer";
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
    activeItem: state =>
      state.items.find(item => item.id === state.activeItemId),
  },

  actions: {
    findBundleById(id: number) {
      return this.items.find(item => item.id === id);
    },

    async getAll(options: IPaginationQuery) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
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
      const { activeItemId: bundleId } = this;
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      const { data } = await axios.get<IBundleBlueprintDto[]>(
        `v1/bundles/${bundleId}/blueprints`,
        {
          params,
        }
      );

      this.setBundleBlueprints(bundleId, data);

      return data;
    },

    async getFiles(blueprintId: number) {
      const { activeItemId: bundleId } = this;
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        blueprintId,
        workspaceId,
      };

      const { data } = await axios.get<IBundleFileDto[]>(
        `v1/bundles/${bundleId}/files`,
        {
          params,
        }
      );

      this.setBundleBlueprintFiles(bundleId, blueprintId, data);

      return data;
    },

    requeue(id: number) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      return axios.post(`v1/bundles/${id}/requeue`, null, {
        params,
      });
    },

    async store(payload: AddBundleDto) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      const { data } = await axios.post<IBundleDto>(`v1/bundles`, payload, {
        params,
      });

      this.items.unshift({ ...data, blueprints: [] });

      return data;
    },

    async download(id: number) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      const { data } = await axios.get<string>(`v1/bundles/${id}`, {
        params,
        responseType: "arraybuffer",
      });

      return data;
    },

    async delete(id: string) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      return axios.delete(`v1/bundles/${id}`, { params });
    },

    setBundleBlueprints(id: number, blueprints: IBundleBlueprintDto[]) {
      const bundle = this.findBundleById(id);

      if (!bundle) {
        return;
      }

      bundle.blueprints = blueprints.map(blueprint => ({
        ...blueprint,
        files: [],
      }));
    },

    setBundleBlueprintFiles(
      id: number,
      blueprintId: number,
      files: IBundleFileDto[]
    ) {
      const bundle = this.findBundleById(id);

      if (!bundle) {
        return;
      }

      const blueprint = bundle.blueprints.find(
        blueprint => blueprint.id === blueprintId
      );

      if (!blueprint) {
        return;
      }

      blueprint.files = files;
    },

    resetState() {
      this.total = 0;
      this.items = [];
      this.activeItemId = 0;
    },
  },
});
