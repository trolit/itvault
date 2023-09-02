import axios from "axios";
import { defineStore } from "pinia";

import { useFilesStore } from "./files";
import { useBundlesStore } from "./bundles";
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

interface IState {
  total: number;
  items: IWorkspaceDto[];
  activeItem: IWorkspaceDto;
  tree: (IDirectoryDto | IFileDto)[];

  activeFileId: number; // @NOTE id of file

  openTabData: { blueprintId: number; variantId: string } | null;

  tabs: FileTab[];
}

export const useWorkspacesStore = defineStore("workspaces", {
  state: (): IState => ({
    tree: [],
    total: 0,
    items: [],
    activeItem: { id: 0, name: "", slug: "", tags: [] },
    activeFileId: 0,
    tabs: [],
    openTabData: null,
  }),

  getters: {
    activeFileTabValue: state =>
      state.tabs.find(tab => tab.file.id === state.activeFileId),
    activeVariantTabValue(): VariantTab | undefined {
      const fileTab = this.activeFileTabValue;

      if (!fileTab) {
        return;
      }

      return fileTab.variantTabs.find(
        variantTab => variantTab.variant.id === fileTab.activeVariantTab
      );
    },
    activeBlueprint(): IBlueprintDto | undefined {
      const variantTab = this.activeVariantTabValue;

      if (!variantTab) {
        return;
      }

      return variantTab.blueprints.find(
        blueprint => blueprint.id === variantTab.activeBlueprint
      );
    },
    activeBucket(): IBucketDto | undefined {
      const variantTab = this.activeVariantTabValue;

      if (!variantTab) {
        return;
      }

      return variantTab.buckets.find(
        bucket => bucket.blueprintId === variantTab.activeBlueprint
      );
    },
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
        activeVariantTab: "",
        notes: { data: [], total: 0 },
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

        if (this.tabs.length) {
          this.activeFileId = this.tabs[0].file.id;
        }
      }
    },

    setVariantTabBlueprints(blueprints: IBlueprintDto[]) {
      if (!this.activeVariantTabValue) {
        return;
      }

      this.activeVariantTabValue.blueprints = blueprints;

      const { variant } = this.activeVariantTabValue;

      if (this.openTabData && variant.id === this.openTabData.variantId) {
        this.setVariantTabActiveBlueprint(this.openTabData.blueprintId);
      }
    },

    setVariantTabActiveBlueprint(id: number) {
      if (!this.activeVariantTabValue) {
        return;
      }

      this.activeVariantTabValue.activeBlueprint = id;
    },

    setVariantTabContent(content: string) {
      if (!this.activeVariantTabValue) {
        return;
      }

      this.activeVariantTabValue.content = content;
    },

    setVariantTabBucket(bucket: IBucketDto) {
      if (!this.activeVariantTabValue) {
        return;
      }

      this.activeVariantTabValue.buckets.push(bucket);
    },

    createVariantTabs(variants: IVariantDto[]) {
      if (!this.activeFileTabValue) {
        return;
      }

      this.activeFileTabValue.variantTabs = variants.map(variant => ({
        variant,
        content: "",
        activeBlueprint: 0,
        blueprints: [],
        isVisible: false,
        buckets: [],
      }));

      if (this.openTabData) {
        this.setVariantTab(this.openTabData.variantId);
      }
    },

    setVariantTab(id: string) {
      if (!this.activeFileTabValue) {
        return;
      }

      const variantTab = this.activeFileTabValue.variantTabs.find(
        variantTab => variantTab.variant.id === id
      );

      if (variantTab && !variantTab.isVisible) {
        variantTab.isVisible = true;
      }

      this.activeFileTabValue.activeVariantTab = id;
    },

    closeVariantTab(id: string) {
      if (!this.activeFileTabValue) {
        return;
      }

      const variantTabToClose = this.activeFileTabValue.variantTabs.find(
        variantTab => variantTab.variant.id === id
      );

      if (!variantTabToClose) {
        return;
      }

      variantTabToClose.isVisible = false;

      const visibleVariantTab = this.activeFileTabValue.variantTabs.find(
        variantTab => variantTab.isVisible === true
      );

      this.activeFileTabValue.activeVariantTab =
        visibleVariantTab?.variant.id || "";
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
  },
});
