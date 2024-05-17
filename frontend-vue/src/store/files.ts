import axios from "axios";
import { defineStore } from "pinia";

import type {
  IFileDTO,
  IFileVariantDTO,
  IPatchFilenameDTO,
  IPatchRelativePathDTO,
} from "@shared/types/DTOs/File";
import { useVariantsStore } from "./variants";
import type { FileTab } from "@/types/FileTab";
import { useWorkspacesStore } from "./workspaces";
import type { IVariantDTO } from "@shared/types/DTOs/Variant";
import type { IBundleFileDTO } from "@shared/types/DTOs/Bundle";

interface IState {
  ROOT: string;
  tabs: FileTab[];
  activeFileId: number;
}

export const useFilesStore = defineStore("files", {
  state: (): IState => ({
    ROOT: ".",
    tabs: [],
    activeFileId: 0,
  }),

  getters: {
    activeTab: state =>
      state.tabs.find(
        tab => !!state.activeFileId && tab.file.id === state.activeFileId
      ),
    activeTabVariants(): IVariantDTO[] {
      return this.activeTab
        ? this.activeTab.variantTabs.map(({ variant }) => variant)
        : [];
    },
  },

  actions: {
    async waitForActiveTabFile(): Promise<IFileDTO> {
      return new Promise(resolve => {
        const interval = setInterval(() => {
          if (this.activeTab?.file) {
            clearInterval(interval);

            return resolve(this.activeTab.file);
          }
        }, 1000);
      });
    },

    async getById(id: number) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      const { data } = await axios.get<IFileDTO>(`v1/files/${id}`, {
        params,
      });

      return data;
    },

    getAll(options: { blueprintId: number }) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        ...options,
        workspaceId,
      };

      return axios.get<IFileVariantDTO[]>(`v1/files`, {
        params,
      });
    },

    async upload(formData: FormData) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      const { data } = await axios.post<IFileDTO[]>("v1/files", formData, {
        params,
      });

      // @NOTE consider replacing upload alert (FilesTab) with manual file structure change

      return data;
    },

    async patchFilename(id: number, filename: string) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      const payload: IPatchFilenameDTO = {
        filename,
      };

      return axios.patch<void>(`v1/files/${id}/filename`, payload, {
        params,
      });
    },

    async patchRelativePath(id: number, relativePath: string) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      const payload: IPatchRelativePathDTO = {
        relativePath,
      };

      return axios.patch<void>(`v1/files/${id}/relative-path`, payload, {
        params,
      });
    },

    delete(id: number) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      return axios.delete(`v1/files/${id}`, { params });
    },

    findTabById(id: number) {
      return this.tabs.find(tab => tab.file.id === id);
    },

    setActiveTab(
      file: IFileDTO,
      toLoad?: { blueprintId?: number; variantId?: string }
    ) {
      const tab = this.findTabById(file.id);

      this.activeFileId = file.id;

      if (tab) {
        const variantsStore = useVariantsStore();

        if (toLoad?.variantId) {
          variantsStore.setActiveTab(toLoad.variantId);
        }

        tab.blueprintIdToLoad = toLoad?.blueprintId;

        return;
      }

      this.tabs.push({
        file,
        variantTabs: [],
        activeVariantId: toLoad?.variantId || "",
        blueprintIdToLoad: toLoad?.blueprintId,
        notes: { page: 1, data: [], total: 0 },
      });
    },

    async setActiveTabWithBundle(arg: {
      blueprintId: number;
      bundleFile: IBundleFileDTO;
    }) {
      const {
        blueprintId,
        bundleFile: { fileId, variantId },
      } = arg;

      const fileTab = this.findTabById(fileId);
      let file = fileTab?.file;

      if (!file) {
        const filesStore = useFilesStore();

        file = await filesStore.getById(fileId);
      }

      this.setActiveTab(file, { variantId, blueprintId });
    },

    closeTab(id: number) {
      const tabIndex = this.tabs.findIndex(tab => tab.file.id === id);

      if (~tabIndex) {
        this.tabs.splice(tabIndex, 1);

        this.activeFileId = this.tabs.length ? this.tabs[0].file.id : 0;
      }
    },

    resetState() {
      this.tabs = [];
      this.activeFileId = 0;
    },
  },
});
