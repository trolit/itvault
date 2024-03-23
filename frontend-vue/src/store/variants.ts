import axios from "axios";
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import { useFilesStore } from "./files";
import { useWorkspacesStore } from "./workspaces";
import type { VariantTab } from "@/types/VariantTab";
import type { IBucketDTO } from "@shared/types/DTOs/Bucket";
import type { IVariantDTO } from "@shared/types/DTOs/Variant";
import type { IPatchNameDTO } from "@shared/types/DTOs/shared";
import type { IBlueprintDTO } from "@shared/types/DTOs/Blueprint";

interface IState {}

export const useVariantsStore = defineStore("variants", {
  state: (): IState => ({}),

  getters: {
    activeTab(): VariantTab | undefined {
      const { activeTab } = useFilesStore();

      if (!activeTab) {
        return;
      }

      return activeTab.variantTabs.find(
        variantTab => variantTab.variant.id === activeTab.activeVariantId
      );
    },

    activeVariantId(): string | undefined {
      return this.activeTab?.variant.id;
    },

    isActiveTabInWriteMode(): boolean {
      return !!this.activeTab?.isWriteModeActive || false;
    },
  },

  actions: {
    async getAll() {
      const { activeFileId: fileId } = useFilesStore();
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        fileId,
        workspaceId,
      };

      const { data } = await axios.get<IVariantDTO[]>("v1/variants", {
        params,
      });

      data.map(variant => this.initializeTab(variant));

      return data;
    },

    async getBlueprintsById(id: string) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      const { data } = await axios.get<IBlueprintDTO[]>(
        `v1/variants/${id}/blueprints`,
        {
          params,
        }
      );

      this.initializeActiveTabBlueprints(data);

      return data;
    },

    async getContentById(id: string) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      const { data } = await axios.get<string>(`v1/variants/${id}/content`, {
        params,
      });

      this.setActiveTabContent(data);

      return data;
    },

    async getBucketById(id: string) {
      const { activeTab } = useVariantsStore();
      const { activeItemId: workspaceId } = useWorkspacesStore();

      if (!activeTab) {
        return;
      }

      const params = {
        version: 1,
        blueprintId: activeTab.activeBlueprintId,
        workspaceId,
      };

      const { data } = await axios.get<IBucketDTO>(`v1/variants/${id}/bucket`, {
        params,
      });

      this.setActiveTabBucket(data);

      return data;
    },

    async add(formData: FormData) {
      const { activeFileId } = useFilesStore();
      const { activeItemId: workspaceId } = useWorkspacesStore();

      formData.append("fileId", activeFileId.toString());

      const params = {
        version: 1,
        workspaceId,
      };

      const { data } = await axios.post<IVariantDTO>("v1/variants", formData, {
        params,
      });

      this.initializeTab(data, { unshift: true });

      return data;
    },

    async patchName(id: string, name: string) {
      const { activeFileId: fileId } = useFilesStore();
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        fileId,
        workspaceId,
      };

      const payload: IPatchNameDTO = {
        name,
      };

      return axios.put(`v1/variants/${id}/name`, payload, {
        params,
      });
    },

    async delete(id: string) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      return axios.delete(`v1/variants/${id}`, { params });
    },

    initializeTab(variant: IVariantDTO, options?: { unshift: boolean }) {
      const { activeTab } = useFilesStore();

      if (!activeTab) {
        return;
      }

      const variantTab = {
        variant,
        content: "",
        buckets: [],
        blueprints: [],
        isVisible: false,
        activeBlueprintId: 0,
        isWriteModeActive: false,
      };

      if (options?.unshift) {
        activeTab.variantTabs.unshift(variantTab);

        return;
      }

      activeTab.variantTabs.push(variantTab);
    },

    initializeActiveTabBlueprints(blueprints: IBlueprintDTO[]) {
      if (!this.activeTab) {
        return;
      }

      this.activeTab.blueprints = blueprints;
    },

    initializeActiveTabBlueprintWithBucket(blueprint: IBlueprintDTO) {
      if (!this.activeTab) {
        return;
      }

      this.activeTab.blueprints.push(blueprint);

      this.activeTab.buckets.push({
        id: 0, // @NOTE this id is not that important as we are using combination of blueprintId + variantId in `upsert`
        blueprintId: blueprint.id,
        initialValue: {},
        value: {},
      });
    },

    setActiveTab(id: string) {
      const { activeTab } = useFilesStore();

      if (!activeTab) {
        return;
      }

      const variantTab = activeTab.variantTabs.find(
        variantTab => variantTab.variant.id === id
      );

      if (!variantTab) {
        return;
      }

      if (!variantTab.isVisible) {
        variantTab.isVisible = true;
      }

      activeTab.activeVariantId = id;
    },

    closeTab(id: string) {
      const { activeTab } = useFilesStore();

      if (!activeTab) {
        return;
      }

      const variantTabToClose = activeTab.variantTabs.find(
        variantTab => variantTab.variant.id === id
      );

      if (!variantTabToClose) {
        return;
      }

      variantTabToClose.isVisible = false;

      const visibleVariantTab = activeTab.variantTabs.find(
        variantTab => variantTab.isVisible === true
      );

      activeTab.activeVariantId = visibleVariantTab?.variant.id || "";
    },

    setActiveTabWriteMode(value: boolean) {
      if (!this.activeTab) {
        console.log("Failed to toggle write mode!");

        return;
      }

      this.activeTab.isWriteModeActive = value;
    },

    setActiveTabBlueprint(id: number | null) {
      if (!this.activeTab) {
        return;
      }

      this.activeTab.activeBlueprintId = id || 0;
    },

    setActiveTabContent(content: string) {
      if (!this.activeTab) {
        return;
      }

      this.activeTab.content = content;
    },

    setActiveTabBucket(bucket: IBucketDTO) {
      if (!this.activeTab) {
        return;
      }

      this.activeTab.buckets.push({
        ...bucket,
        initialValue: cloneDeep(bucket.value),
      });
    },
  },
});
