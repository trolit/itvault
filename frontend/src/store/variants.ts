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
      const filesStore = useFilesStore();

      const tab = filesStore.activeTab;

      if (!tab) {
        return;
      }

      return tab.variantTabs.find(
        variantTab => variantTab.variant.id === tab.activeVariantId
      );
    },

    isActiveTabInWriteMode(): boolean {
      return !!this.activeTab?.isWriteModeActive || false;
    },
  },

  actions: {
    async getAll() {
      const filesStore = useFilesStore();
      const workspacesStore = useWorkspacesStore();

      const { activeItem } = workspacesStore;

      const params = {
        version: 1,
        fileId: filesStore.activeFileId,
        workspaceId: activeItem.id,
      };

      const { data } = await axios.get<IVariantDto[]>("v1/variants", {
        params,
      });

      this.initializeTabs(data);

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

      this.initializeActiveTabBlueprints(data);

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

      this.setActiveTabContent(data);

      return data;
    },

    async getBucketById(id: string) {
      const variantsStore = useVariantsStore();
      const workspacesStore = useWorkspacesStore();

      const variantTab = variantsStore.activeTab;

      if (!variantTab) {
        return;
      }

      const params = {
        version: 1,
        blueprintId: variantTab.activeBlueprintId,
        workspaceId: workspacesStore.activeItem.id,
      };

      const { data } = await axios.get<IBucketDto>(`v1/variants/${id}/bucket`, {
        params,
      });

      this.setActiveTabBucket(data);

      return data;
    },

    async store(formData: FormData) {
      const filesStore = useFilesStore();
      const workspacesStore = useWorkspacesStore();

      formData.append("fileId", filesStore.activeFileId.toString());

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
      };

      const { data } = await axios.post<IVariantDto>("v1/variants", formData, {
        params,
      });

      this.createTab(data, { unshift: true });

      return data;
    },

    createTab(variant: IVariantDto, options?: { unshift: boolean }) {
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

    initializeTabs(variants: IVariantDto[]) {
      const { openTabData } = useWorkspacesStore();

      variants.map(variant => this.createTab(variant));

      if (openTabData) {
        this.setActiveTab(openTabData.variantId);
      }
    },

    initializeActiveTabBlueprints(blueprints: IBlueprintDto[]) {
      const { tabToOpenData } = useFilesStore();

      if (!this.activeTab) {
        return;
      }

      this.activeTab.blueprints = blueprints;

      const { variant } = this.activeTab;

      if (tabToOpenData && variant.id === tabToOpenData.variantId) {
        this.setActiveTabBlueprint(tabToOpenData.blueprintId);
      }
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
