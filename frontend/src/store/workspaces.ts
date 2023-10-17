import axios from "axios";
import { defineStore } from "pinia";

import { useFilesStore } from "./files";
import { useBundlesStore } from "./bundles";
import { useBlueprintsStore } from "./blueprints";
import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";
import type { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";
import type { AddEditWorkspaceDto } from "@shared/types/dtos/AddEditWorkspaceDto";

interface IState {
  total: number;
  items: IWorkspaceDto[];
  isSiderCollapsed: boolean;
  activeItem: IWorkspaceDto;
  itemToEdit: IWorkspaceDto | null;
  tree: (IDirectoryDto | IFileDto)[];
}

export const useWorkspacesStore = defineStore("workspaces", {
  state: (): IState => ({
    tree: [],
    total: 0,
    items: [],
    itemToEdit: null,
    isSiderCollapsed: false,
    activeItem: { id: 0, name: "", slug: "", tags: [] },
  }),

  getters: {
    ITEMS_PER_PAGE: () => 10,
    TRIGGER_STYLE_TOP: () => "31px",
    TRIGGER_STYLE_HEIGHT: () => "17px",
    activeItemId: state => state.activeItem.id,
  },

  actions: {
    toggleSider() {
      this.isSiderCollapsed = !this.isSiderCollapsed;
    },

    setActiveItem(item: IWorkspaceDto) {
      this.activeItem = item;

      this.tree = [];

      const filesStore = useFilesStore();
      const bundlesStore = useBundlesStore();
      const blueprintsStore = useBlueprintsStore();

      filesStore.resetState();
      bundlesStore.resetState();
      blueprintsStore.resetState();
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
    async getTree(options: { relativePath: string }, isReload?: boolean) {
      const params = {
        version: 1,
        ...options,
      };

      const { data } = await axios.get<(IFileDto | IDirectoryDto)[]>(
        `v1/workspaces/${this.activeItem.id}/tree`,
        {
          params,
        }
      );

      this.tree = isReload ? data : Array.prototype.concat(this.tree, data);

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
