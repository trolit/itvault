import axios from "axios";
import { defineStore } from "pinia";
import kebabCase from "lodash/kebabCase";
import type { TreeOption } from "naive-ui";
import type { RouteLocationNormalizedLoaded } from "vue-router";

import type {
  IWorkspaceDTO,
  IWorkspaceTraceDTO,
  IAddEditWorkspaceDTO,
  IWorkspaceActivityDataPointDTO,
} from "@shared/types/DTOs/Workspace";
import isFile from "@/helpers/isFile";
import { useFilesStore } from "./files";
import { useBundlesStore } from "./bundles";
import { useGeneralStore } from "./general";
import { useInsightsStore } from "./insights";
import { useVariantsStore } from "./variants";
import isDirectory from "@/helpers/isDirectory";
import { useBlueprintsStore } from "./blueprints";
import type { IFileDTO } from "@shared/types/DTOs/File";
import { useDateService } from "@/services/useDateService";
import type { IContributorDTO } from "@shared/types/DTOs/User";
import { silentlyUpdateUrl } from "@/helpers/silentlyUpdateUrl";
import createFileTreeOption from "@/helpers/createFileTreeOption";
import type { IDirectoryDTO } from "@shared/types/DTOs/Directory";
import createFolderTreeOption from "@/helpers/createFolderTreeOption";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { DatePrecision } from "@shared/types/enums/DatePrecision";
import type { PaginatedResponse } from "@shared/types/PaginatedResponse";
import type { WorkspaceSearchParams } from "@/types/WorkspaceSearchParams";
import { getUniqueTreeRelativePaths } from "@/helpers/getUniqueTreeRelativePaths";
import type { UpdateWorkspaceData } from "@shared/types/transport/WorkspaceMessages";

interface IState {
  total: number;
  treeData: TreeOption[];
  items: IWorkspaceDTO[];
  recentlyFilteredItems: IWorkspaceDTO[];
  activeItem: IWorkspaceDTO;
  itemToEdit: IWorkspaceDTO | null;
  tree: (IDirectoryDTO | IFileDTO)[];
  generalLayoutSiderKey: string;
  treeDataExpandedKeys: (string | number)[];
  pinStatusUpdateItemId: number;
  isGeneralSiderCollapsed: boolean;
  isFilePageSiderCollapsed: boolean;
}

export const useWorkspacesStore = defineStore("workspaces", {
  state: (): IState => ({
    tree: [],
    total: 0,
    items: [],
    recentlyFilteredItems: [],
    treeData: [],
    itemToEdit: null,
    generalLayoutSiderKey: "",
    activeItem: {
      id: 0,
      name: "",
      description: "",
      slug: "",
      pinnedAt: "",
      tags: [],
    },
    treeDataExpandedKeys: [],
    pinStatusUpdateItemId: 0,
    isGeneralSiderCollapsed: false,
    isFilePageSiderCollapsed: false,
  }),

  getters: {
    GENERAL_SIDER_WIDTH: () => 340,
    FILE_PAGE_SIDER_WIDTH: () => 250,
    VARIANT_VIEWER_WIDTH(): string {
      const generalStore = useGeneralStore();

      let toSubtract = 0;

      if (generalStore.isChatVisible) {
        toSubtract += generalStore.GLOBAL_CHAT_WIDTH;
      }

      if (!this.isGeneralSiderCollapsed) {
        toSubtract += this.GENERAL_SIDER_WIDTH;
      }

      if (!this.isFilePageSiderCollapsed) {
        toSubtract += this.FILE_PAGE_SIDER_WIDTH;
      }

      return `calc(100vw - ${toSubtract}px)`;
    },
    ITEMS_PER_PAGE: () => 10,
    TRIGGER_STYLE_TOP: () => "31px",
    TRIGGER_STYLE_HEIGHT: () => "17px",
    activeItemId: state => state.activeItem.id,
    ALL_DIRS(): IDirectoryDTO[] {
      return this.tree.filter(item => isDirectory(item));
    },
    SEARCH_PARAMS(): WorkspaceSearchParams {
      const { activeFileId } = useFilesStore();
      const { activeTab } = useVariantsStore();

      const fileId = activeFileId ? activeFileId.toString() : null;
      const variantId = activeTab?.variant.id || null;
      const blueprintId = activeTab?.activeBlueprintId
        ? activeTab?.activeBlueprintId.toString()
        : null;

      return {
        fileId,
        variantId,
        blueprintId,
      };
    },
  },

  actions: {
    toggleGeneralSider() {
      this.isGeneralSiderCollapsed = !this.isGeneralSiderCollapsed;
    },

    toggleFilePageSider() {
      this.isFilePageSiderCollapsed = !this.isFilePageSiderCollapsed;
    },

    setActiveItem(item: IWorkspaceDTO) {
      this.activeItem = item;

      this.tree = [];

      const filesStore = useFilesStore();
      const bundlesStore = useBundlesStore();
      const insightsStore = useInsightsStore();
      const blueprintsStore = useBlueprintsStore();

      filesStore.resetState();
      bundlesStore.resetState();
      insightsStore.resetState();
      blueprintsStore.resetState();
    },

    getContributors() {
      const params = {
        version: 1,
      };

      return axios.get<IContributorDTO[]>(
        `v1/workspaces/${this.activeItemId}/contributors`,
        { params }
      );
    },

    getTraces(query: IPaginationQuery) {
      const params = {
        version: 1,
        ...query,
      };

      return axios.get<PaginatedResponse<IWorkspaceTraceDTO>>(
        `v1/workspaces/${this.activeItemId}/traces`,
        {
          params,
        }
      );
    },

    getTracesSeries(query: {
      from: number;
      to: number;
      precision: DatePrecision;
      filters: {
        userId?: number;
      };
    }) {
      const { filters, ...otherQueryProperties } = query;

      const params = {
        version: 1,
        ...otherQueryProperties,
        filters: JSON.stringify(filters),
      };

      return axios.get<IWorkspaceActivityDataPointDTO[]>(
        `v1/workspaces/${this.activeItemId}/traces-series`,
        {
          params,
        }
      );
    },

    async getBySlug(slug: string) {
      const params = {
        version: 1,
      };

      const { data } = await axios.get<IWorkspaceDTO>(`v1/workspaces/${slug}`, {
        params,
      });

      this.activeItem = data;

      return data;
    },

    async getAll(
      query: Partial<IPaginationQuery> & {
        ignorePagination?: boolean;

        filters: { userId?: number; name?: string };
      },
      options = { keepInStore: true }
    ) {
      const { page, perPage, ignorePagination, filters } = query;

      const params = {
        version: 1,
        page,
        perPage,
        ignorePagination,
        filters: JSON.stringify(filters),
      };

      const { data } = await axios.get<PaginatedResponse<IWorkspaceDTO>>(
        "v1/workspaces",
        {
          params,
        }
      );

      if (options.keepInStore) {
        this.items = data.result;

        this.total = data.total;
      }

      return data;
    },

    // @TODO add option to query tree by blueprintId
    async getTree(options: { relativePath: string }, isReload?: boolean) {
      const params = {
        version: 1,
        ...options,
      };

      const { data } = await axios.get<(IFileDTO | IDirectoryDTO)[]>(
        `v1/workspaces/${this.activeItem.id}/tree`,
        {
          params,
        }
      );

      this.tree = isReload ? data : Array.prototype.concat(this.tree, data);

      return data;
    },

    async pin(id: number) {
      const generalStore = useGeneralStore();
      const dateService = useDateService();

      if (this.pinStatusUpdateItemId) {
        return;
      }

      this.pinStatusUpdateItemId = id;

      try {
        await axios.post(
          `v1/workspaces/${id}/pin`,
          {},
          { params: { version: 1 } }
        );

        const itemIndex = this.items.findIndex(
          workspace => workspace.id === id
        );

        if (~itemIndex) {
          this.items[itemIndex].pinnedAt = dateService.now().toISOString();
        }

        generalStore.messageProvider.success(`Workspace pinned!`);
      } catch (error) {
        console.log(error);

        generalStore.messageProvider.error(`Failed to pin workspace!`);
      } finally {
        this.pinStatusUpdateItemId = 0;
      }
    },

    async unpin(id: number) {
      const generalStore = useGeneralStore();

      if (this.pinStatusUpdateItemId) {
        return;
      }

      this.pinStatusUpdateItemId = id;

      try {
        await axios.post(
          `v1/workspaces/${id}/unpin`,
          {},
          { params: { version: 1 } }
        );

        const itemIndex = this.items.findIndex(
          workspace => workspace.id === id
        );

        if (~itemIndex) {
          this.items[itemIndex].pinnedAt = null;
        }

        generalStore.messageProvider.success(`Workspace unpinned!`);
      } catch (error) {
        console.log(error);

        generalStore.messageProvider.error(`Failed to unpin workspace!`);
      } finally {
        this.pinStatusUpdateItemId = 0;
      }
    },

    async add(payload: IAddEditWorkspaceDTO) {
      return axios.post<IAddEditWorkspaceDTO>("v1/workspaces", payload, {
        params: { version: 1 },
      });
    },

    async update(payload: IAddEditWorkspaceDTO) {
      if (!this.itemToEdit || !this.itemToEdit.id) {
        return;
      }

      const id = this.itemToEdit.id;

      await axios.put(`v1/workspaces/${id}`, payload, {
        params: { version: 1 },
      });
    },

    onUpdate(data: UpdateWorkspaceData) {
      const updatedWorkspaceIndex = this.items.findIndex(
        item => item.id === data.id
      );

      if (~updatedWorkspaceIndex) {
        const currentItem = this.items[updatedWorkspaceIndex];

        // @TODO (at this moment) slug depends on workspace name. At BE Workspace/UpdateController send to users (viewing that workspace) message to update their URLs
        this.items.splice(updatedWorkspaceIndex, 1, {
          ...currentItem,
          slug: kebabCase(data.name),
          ...data,
        });
      }
    },

    getUrlSearchParamValue(
      route: RouteLocationNormalizedLoaded,
      key: keyof WorkspaceSearchParams
    ): string | null {
      const { query } = route;

      const { [key]: value } = query;

      if (!value) {
        return null;
      }

      return value.toString();
    },

    updateUrlSearchParams() {
      const { SEARCH_PARAMS } = this;

      const searchParams = new URLSearchParams();

      const keys = Object.keys(SEARCH_PARAMS);

      for (const key of keys) {
        const searchParamsKey = key as keyof WorkspaceSearchParams;

        const value = SEARCH_PARAMS[searchParamsKey];

        if (!value) {
          continue;
        }

        searchParams.append(key, value.toString());
      }

      silentlyUpdateUrl({ searchParams });
    },

    _getTreeOptionChildrenByRelativePath(path: string) {
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

          const treeOptionChildren =
            this._getTreeOptionChildrenByRelativePath(relativePath);

          if (Array.isArray(treeOptionChildren) && isValueFile) {
            treeOptionChildren.push(treeOptionToAdd);
          } else if (isValueFile) {
            this.treeData.push(treeOptionToAdd);
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
