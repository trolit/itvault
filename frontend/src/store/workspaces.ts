import axios from "axios";
import { defineStore } from "pinia";

import type { VariantTab } from "@/types/VariantTab";
import type { INoteDto } from "@shared/types/dtos/INoteDto";
import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";
import type { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";

interface IState {
  total: number;
  items: IWorkspaceDto[];
  activeItem: IWorkspaceDto;
  tree: (IDirectoryDto & IFileDto)[];

  // @TODO REFACTOR!!!!

  activeFileTab: number; // @NOTE id of file
  tabs: {
    file: IFileDto;
    activeVariantTab: string; // @NOTE id of variant
    notes: { data: INoteDto[]; total: number };
    variantTabs: VariantTab[];
  }[];
}

export const useWorkspacesStore = defineStore("workspaces", {
  state: (): IState => ({
    tree: [],
    total: 0,
    items: [],
    activeItem: { id: 0, name: "", slug: "", tags: [] },
    activeFileTab: 0,
    tabs: [],
  }),

  getters: {
    activeFileTabValue: state =>
      state.tabs.find(tab => tab.file.id === state.activeFileTab),
    activeVariantTabValue(): VariantTab | undefined {
      const fileTab = this.activeFileTabValue;

      if (!fileTab) {
        return;
      }

      return fileTab.variantTabs.find(
        variantTab => variantTab.variant.id === fileTab.activeVariantTab
      );
    },
  },

  actions: {
    setActiveItem(item: IWorkspaceDto) {
      this.activeItem = item;
    },

    setFileTab(file: IFileDto) {
      const tab = this.tabs.find(tab => tab.file.id === file.id);

      this.activeFileTab = file.id;

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

    closeFileTab(id: number) {
      // @NOTE consider adding "isHidden" flag (like with variant tab)
      const tabIndex = this.tabs.findIndex(tab => tab.file.id === id);

      if (~tabIndex) {
        this.tabs.splice(tabIndex, 1);

        if (this.tabs.length) {
          this.activeFileTab = this.tabs[0].file.id;
        }
      }
    },

    setVariantTab(id: string) {
      if (!this.activeFileTabValue) {
        return;
      }

      const variantTab = this.activeFileTabValue.variantTabs.find(
        variantTab => variantTab.variant.id === id
      );

      if (!variantTab) {
        return;
      }

      this.activeFileTabValue.activeVariantTab = id;

      variantTab.isVisible = false;
    },

    closeVariantTab(id: string) {
      if (!this.activeFileTabValue) {
        return;
      }

      const variantTab = this.activeFileTabValue.variantTabs.find(
        variantTab => variantTab.variant.id === id
      );

      if (!variantTab) {
        return;
      }

      if (this.activeFileTabValue.activeVariantTab === id) {
        this.activeFileTabValue.activeVariantTab = "";
      }

      variantTab.isVisible = false;
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
