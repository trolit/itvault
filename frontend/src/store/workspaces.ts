import axios from "axios";
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";

import { useFilesStore } from "./files";
import { useBundlesStore } from "./bundles";
import type { Bucket } from "@/types/Bucket";
import type { FileTab } from "@/types/FileTab";
import { useBlueprintsStore } from "./blueprints";
import type { VariantTab } from "@/types/VariantTab";
import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IBucketDto } from "@shared/types/dtos/IBucketDto";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";
import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";
import type { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { IBundleFileDto } from "@shared/types/dtos/IBundleFileDto";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";
import type { AddEditWorkspaceDto } from "@shared/types/dtos/AddEditWorkspaceDto";

interface IState {
  total: number;
  items: IWorkspaceDto[];
  activeItem: IWorkspaceDto;
  itemToEdit: IWorkspaceDto | null;
  tree: (IDirectoryDto | IFileDto)[];

  activeFileId: number;

  openTabData: { blueprintId: number; variantId: string } | null;

  tabs: FileTab[];
}

export const useWorkspacesStore = defineStore("workspaces", {
  state: (): IState => ({
    tree: [],
    total: 0,
    items: [],
    itemToEdit: null,
    activeItem: { id: 0, name: "", slug: "", tags: [] },
    activeFileId: 0,
    tabs: [],
    openTabData: null,
  }),

  getters: {
    activeFileTab: state =>
      state.tabs.find(tab => tab.file.id === state.activeFileId),
    activeVariantTab(): VariantTab | undefined {
      const fileTab = this.activeFileTab;

      if (!fileTab) {
        return;
      }

      return fileTab.variantTabs.find(
        variantTab => variantTab.variant.id === fileTab.activeVariantId
      );
    },
    activeBlueprintId(): IBlueprintDto | undefined {
      const variantTab = this.activeVariantTab;

      if (!variantTab) {
        return;
      }

      return variantTab.blueprints.find(
        blueprint => blueprint.id === variantTab.activeBlueprintId
      );
    },
    activeBucket(): Bucket | undefined {
      const variantTab = this.activeVariantTab;

      if (!variantTab) {
        return;
      }

      return variantTab.buckets.find(
        bucket => bucket.blueprintId === variantTab.activeBlueprintId
      );
    },
    ITEMS_PER_PAGE: () => 10,
  },

  actions: {
    setActiveItem(item: IWorkspaceDto) {
      this.activeItem = item;

      this.tree = [];
      this.tabs = [];
      this.activeFileId = 0;

      const bundlesStore = useBundlesStore();
      const blueprintsStore = useBlueprintsStore();

      bundlesStore.resetState();
      blueprintsStore.resetState();
    },

    setFileTab(file: IFileDto) {
      const tab = this.tabs.find(tab => tab.file.id === file.id);

      this.activeFileId = file.id;

      if (tab) {
        return;
      }

      this.tabs.push({
        file,
        variantTabs: [],
        activeVariantId: "",
        notes: { page: 1, data: [], total: 0 },
      });
    },

    async setFileTabFromBundle(
      bundleFile: IBundleFileDto,
      blueprintId: number
    ) {
      const { fileId, variantId } = bundleFile;

      const fileTab = this.tabs.find(tab => tab.file.id === fileId);
      let file = fileTab?.file;

      if (!file) {
        const filesStore = useFilesStore();

        file = await filesStore.getById(fileId);
      }

      this.setFileTab(file);

      this.openTabData = { blueprintId, variantId };
    },

    closeFileTab(id: number) {
      // @NOTE consider adding "isHidden" flag (like with variant tab)
      const tabIndex = this.tabs.findIndex(tab => tab.file.id === id);

      if (~tabIndex) {
        this.tabs.splice(tabIndex, 1);

        this.activeFileId = this.tabs.length ? this.tabs[0].file.id : 0;
      }
    },

    setVariantTabBlueprints(blueprints: IBlueprintDto[]) {
      if (!this.activeVariantTab) {
        return;
      }

      this.activeVariantTab.blueprints = blueprints;

      const { variant } = this.activeVariantTab;

      if (this.openTabData && variant.id === this.openTabData.variantId) {
        this.setVariantTabActiveBlueprint(this.openTabData.blueprintId);
      }
    },

    setVariantTabWriteMode(value: boolean) {
      if (!this.activeVariantTab) {
        return;
      }

      this.activeVariantTab.isWriteModeActive = value;
    },

    setVariantTabActiveBlueprint(id: number) {
      if (!this.activeVariantTab) {
        return;
      }

      this.activeVariantTab.activeBlueprintId = id;
    },

    setVariantTabContent(content: string) {
      if (!this.activeVariantTab) {
        return;
      }

      this.activeVariantTab.content = content;
    },

    setVariantTabBucket(bucket: IBucketDto) {
      if (!this.activeVariantTab) {
        return;
      }

      this.activeVariantTab.buckets.push({
        ...bucket,
        initialValue: cloneDeep(bucket.value),
      });
    },

    addVariantTab(variant: IVariantDto, options?: { unshift: boolean }) {
      if (!this.activeFileTab) {
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
        this.activeFileTab.variantTabs.unshift(variantTab);

        return;
      }

      this.activeFileTab.variantTabs.push(variantTab);
    },

    createVariantTabs(variants: IVariantDto[]) {
      if (!this.activeFileTab) {
        return;
      }

      variants.map(variant => this.addVariantTab(variant));

      if (this.openTabData) {
        this.setVariantTab(this.openTabData.variantId);
      }
    },

    setVariantTab(id: string) {
      if (!this.activeFileTab) {
        return;
      }

      const variantTab = this.activeFileTab.variantTabs.find(
        variantTab => variantTab.variant.id === id
      );

      if (variantTab && !variantTab.isVisible) {
        variantTab.isVisible = true;
      }

      this.activeFileTab.activeVariantId = id;
    },

    closeVariantTab(id: string) {
      if (!this.activeFileTab) {
        return;
      }

      const variantTabToClose = this.activeFileTab.variantTabs.find(
        variantTab => variantTab.variant.id === id
      );

      if (!variantTabToClose) {
        return;
      }

      variantTabToClose.isVisible = false;

      const visibleVariantTab = this.activeFileTab.variantTabs.find(
        variantTab => variantTab.isVisible === true
      );

      this.activeFileTab.activeVariantId = visibleVariantTab?.variant.id || "";
    },

    async getBySlug(slug: string) {
      const params = {
        version: 1,
      };

      const { data } = await axios.get<IWorkspaceDto>(`v1/workspaces/${slug}`, {
        params,
      });

      this.activeItem = data;

      return data;
    },

    async getAll(query: IPaginationQuery) {
      const params = {
        version: 1,
        ...query,
      };

      const { data } = await axios.get<PaginatedResponse<IWorkspaceDto>>(
        "v1/workspaces",
        {
          params,
        }
      );

      this.items = data.result;

      this.total = data.total;

      return data;
    },

    // @TODO add option to query tree by blueprintId
    async getTree(options: { relativePath: string }) {
      const params = {
        version: 1,
        ...options,
      };

      const { data } = await axios.get<(IFileDto & IDirectoryDto)[]>(
        `v1/workspaces/${this.activeItem.id}/tree`,
        {
          params,
        }
      );

      this.tree = Array.prototype.concat(this.tree, data);

      return data;
    },

    async store(payload: AddEditWorkspaceDto) {
      return axios.post<AddEditWorkspaceDto>("v1/workspaces", payload, {
        params: { version: 1 },
      });
    },

    async update(payload: AddEditWorkspaceDto) {
      if (!this.itemToEdit || !this.itemToEdit.id) {
        return;
      }

      const id = this.itemToEdit.id;

      await axios.put(`v1/workspaces/${id}`, payload, {
        params: { version: 1 },
      });

      const updatedWorkspaceIndex = this.items.findIndex(
        item => item.id === id
      );

      if (~updatedWorkspaceIndex) {
        this.items.splice(updatedWorkspaceIndex, 1, {
          ...this.itemToEdit,
          ...payload,
        });
      }
    },
  },
});
