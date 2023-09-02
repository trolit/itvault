import axios from "axios";
import { defineStore } from "pinia";

import { useWorkspacesStore } from "./workspaces";
import type { IBucketDto } from "@shared/types/dtos/IBucketDto";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

interface IState {}

export const useVariantsStore = defineStore("variants", {
  state: (): IState => ({}),

  actions: {
    async getAll() {
      const workspacesStore = useWorkspacesStore();

      const { activeFileId, activeItem } = workspacesStore;

      const params = {
        version: 1,
        fileId: activeFileId,
        workspaceId: activeItem.id,
      };

      const { data } = await axios.get<IVariantDto[]>("v1/variants", {
        params,
      });

      workspacesStore.createVariantTabs(data);

      return data;
    },

    async getBlueprintsById(id: string) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
      };

      const { data } = await axios.get<IBlueprintDto[]>(
        `v1/variants/${id}/blueprints`,
        {
          params,
        }
      );

      workspacesStore.setVariantTabBlueprints(data);

      return data;
    },

    async getContentById(id: string) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
      };

      const { data } = await axios.get<string>(`v1/variants/${id}/content`, {
        params,
      });

      workspacesStore.setVariantTabContent(data);

      return data;
    },

    async getBucketById(id: string) {
      const workspacesStore = useWorkspacesStore();

      const variantTab = workspacesStore.activeVariantTab;

      if (!variantTab) {
        return;
      }

      const params = {
        version: 1,
        blueprintId: variantTab.activeBlueprint,
        workspaceId: workspacesStore.activeItem.id,
      };

      const { data } = await axios.get<IBucketDto>(`v1/variants/${id}/bucket`, {
        params,
      });

      workspacesStore.setVariantTabBucket(data);

      return data;
    },
  },
});
