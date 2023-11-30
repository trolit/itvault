import axios from "axios";
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import { useFilesStore } from "./files";
import { useWorkspacesStore } from "./workspaces";
import type { VariantTab } from "@/types/VariantTab";
import type { IBucketDto } from "@shared/types/dtos/IBucketDto";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

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

      const { data } = await axios.get<IVariantDto[]>("v1/variants", {
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

      const { data } = await axios.get<IBlueprintDto[]>(
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

      const { data } = await axios.get<IBucketDto>(`v1/variants/${id}/bucket`, {
        params,
      });

      this.setActiveTabBucket(data);

      return data;
    },

    async store(formData: FormData) {
      const { activeFileId } = useFilesStore();
      const { activeItemId: workspaceId } = useWorkspacesStore();

      formData.append("fileId", activeFileId.toString());

      const params = {
        version: 1,
        workspaceId,
      };

      const { data } = await axios.post<IVariantDto>("v1/variants", formData, {
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

      return axios.put(
        `v1/variants/${id}/name`,
        { name },
        {
          params,
        }
      );
    },

    async delete(id: string) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      return axios.delete(`v1/variants/${id}`, { params });
    },

    initializeTab(variant: IVariantDto, options?: { unshift: boolean }) {
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

    initializeActiveTabBlueprints(blueprints: IBlueprintDto[]) {
      if (!this.activeTab) {
        return;
      }

      this.activeTab.blueprints = blueprints;
    },

    initializeActiveTabBlueprintWithBucket(blueprint: IBlueprintDto) {
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

    overwriteActiveInformationIfPossible(data: {
      variant?: boolean;
      blueprint?: boolean;
    }) {
      const filesStore = useFilesStore();
      const { variant, blueprint } = data;
      const { tabToOpenData } = filesStore;

      if (!tabToOpenData) {
        return;
      }

      if (variant) {
        this.setActiveTab(tabToOpenData.variantId);
      }

      if (blueprint) {
        this.setActiveTabBlueprint(tabToOpenData.blueprintId);

        filesStore.tabToOpenData = null;
      }
    },

    setActiveTab(id: string) {
      const { activeTab } = useFilesStore();

      if (!activeTab) {
        return;
      }

      const variantTab = activeTab.variantTabs.find(
        variantTab => variantTab.variant.id === id
      );

      if (variantTab && !variantTab.isVisible) {
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

    setActiveTabBlueprint(id: number) {
      if (!this.activeTab) {
        return;
      }

      this.activeTab.activeBlueprintId = id;
    },

    setActiveTabContent(content: string) {
      if (!this.activeTab) {
        return;
      }

      this.activeTab.content = content;
    },

    setActiveTabBucket(bucket: IBucketDto) {
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
