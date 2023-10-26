import axios from "axios";
import { defineStore } from "pinia";
import type { TreeOption } from "naive-ui";
import type { RouteLocationNormalizedLoaded } from "vue-router";

import isFile from "@/helpers/isFile";
import { useFilesStore } from "./files";
import { useBundlesStore } from "./bundles";
import { useVariantsStore } from "./variants";
import isDirectory from "@/helpers/isDirectory";
import { useBlueprintsStore } from "./blueprints";
import type { IFileDto } from "@shared/types/dtos/IFileDto";
import createFileTreeOption from "@/helpers/createFileTreeOption";
import createFolderTreeOption from "@/helpers/createFolderTreeOption";
import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";
import type { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";
import type { WorkspaceSearchParams } from "@/types/WorkspaceSearchParams";
import type { AddEditWorkspaceDto } from "@shared/types/dtos/AddEditWorkspaceDto";
import { getUniqueTreeRelativePaths } from "@/helpers/getUniqueTreeRelativePaths";

interface IState {
  total: number;
  treeData: TreeOption[];
  items: IWorkspaceDto[];
  isSiderCollapsed: boolean;
  activeItem: IWorkspaceDto;
  itemToEdit: IWorkspaceDto | null;
  tree: (IDirectoryDto | IFileDto)[];
  generalLayoutSiderKey: string;
  treeDataExpandedKeys: (string | number)[];
}

export const useWorkspacesStore = defineStore("workspaces", {
  state: (): IState => ({
    tree: [],
    total: 0,
    items: [],
    treeData: [],
    itemToEdit: null,
    isSiderCollapsed: false,
    generalLayoutSiderKey: "",
    activeItem: { id: 0, name: "", slug: "", tags: [] },
    treeDataExpandedKeys: [],
  }),

  getters: {
    ITEMS_PER_PAGE: () => 10,
    TRIGGER_STYLE_TOP: () => "31px",
    TRIGGER_STYLE_HEIGHT: () => "17px",
    DEFAULT_GENERAL_LAYOUT_SIDER_KEY: () => "blueprints",
    activeItemId: state => state.activeItem.id,
    SEARCH_PARAMS(): WorkspaceSearchParams {
      const { activeFileId } = useFilesStore();
      const { activeTab } = useVariantsStore();

      const fileParams =
        activeFileId === 0
          ? {
              fileId: null,
              variantId: null,
              blueprintId: null,
            }
          : {
              fileId: activeFileId.toString(),
              variantId: activeTab?.variant.id || null,
              blueprintId: activeTab?.activeBlueprintId
                ? activeTab?.activeBlueprintId.toString()
                : null,
            };

      return {
        sider: this.generalLayoutSiderKey,
        ...fileParams,
      };
    },
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

    getUrlSearchParamValue(
      route: RouteLocationNormalizedLoaded,
      key: keyof WorkspaceSearchParams
    ) {
      const { query } = route;

      const { [key]: value } = query;

      if (!value) {
        return null;
      }

      return value;
    },

    updateUrlSearchParams() {
      const { SEARCH_PARAMS } = this;

      const searchParams = new URLSearchParams();

      const keys = Object.keys(SEARCH_PARAMS);

      for (const key of keys) {
        const value = SEARCH_PARAMS[key as keyof WorkspaceSearchParams];

        if (!value) {
          continue;
        }

        if (Array.isArray(value)) {
          // @TODO implement when needed

          continue;
        }

        searchParams.append(key, value.toString());
      }

      const {
        location: { origin, pathname },
      } = window;

      history.pushState(
        {},
        "",
        `${origin}${pathname}?${searchParams.toString()}`
      );
    },

    _findTreeOptionByPath(path: string) {
      const [, ...splitPathExceptRoot] = path.split("/");

      let treeOption: TreeOption | undefined;
      let currentRelativePath = ".";

      for (const pathPart of splitPathExceptRoot) {
        currentRelativePath += `/${pathPart}`;

        const nextTreeOption = treeOption?.children
          ? treeOption.children.find(({ label }) => label === pathPart)
          : this.treeData.find(({ label }) => label === pathPart);

        if (!nextTreeOption) {
          const treeValue = this.tree.find(
            value =>
              value.relativePath === currentRelativePath && isDirectory(value)
          );

          if (!treeValue) {
            continue;
          }

          const folder = createFolderTreeOption(treeValue);

          const hasAnyFile = this.tree.some(
            value => value.relativePath === currentRelativePath && isFile(value)
          );

          if (hasAnyFile) {
            folder.children = [];
          }

          if (treeOption) {
            treeOption.children = treeOption.children
              ? Array.prototype.concat(treeOption.children, [folder])
              : [folder];

            treeOption = treeOption.children[treeOption.children.length - 1];
          } else {
            this.treeData.push(folder);

            treeOption = this.treeData[this.treeData.length - 1];
          }

          continue;
        }

        treeOption = nextTreeOption;
      }

      return treeOption?.children;
    },

    initTree() {
      this.treeData = [];
      this.treeDataExpandedKeys = [];

      const uniqueRelativePaths = getUniqueTreeRelativePaths(this.tree);

      for (const relativePath of uniqueRelativePaths) {
        const values = this.tree.filter(
          value => value.relativePath === relativePath
        );

        for (const value of values) {
          const isValueFile = isFile(value);

          const treeOptionToAdd = isValueFile
            ? createFileTreeOption(value)
            : createFolderTreeOption(value);

          if (!isValueFile) {
            const hasAnyFile = this.tree.some(
              value => value.relativePath === relativePath && isFile(value)
            );

            treeOptionToAdd.children = hasAnyFile ? [] : undefined;
          }

          const location = this._findTreeOptionByPath(relativePath);

          if (Array.isArray(location) && isValueFile) {
            location.push(treeOptionToAdd);
          }
        }
      }
    },

    setTreeDataExpandedKeysByRelativePath(relativePath: string) {
      const splitRelativePath = relativePath.split("/");
      const length = splitRelativePath.length;

      for (let index = 1; index < length; index++) {
        const path = splitRelativePath.slice(0, index + 1).join("/");

        const dir = this.tree.find(
          value => value.relativePath === path && isDirectory(value)
        );

        if (dir) {
          this.treeDataExpandedKeys.push(`folder-${dir.id}`);
        }
      }
    },

    toggleTreeDir(key: string) {
      const index = this.treeDataExpandedKeys.findIndex(
        expandedKey => expandedKey === key
      );

      if (~index) {
        this.treeDataExpandedKeys.splice(index, 1);

        return;
      }

      this.treeDataExpandedKeys.push(key);
    },
  },
});
