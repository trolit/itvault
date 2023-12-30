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
import type { IBundleFileDTO } from "@shared/types/DTOs/Bundle";

interface IState {
  ROOT: string;
  tabs: FileTab[];
  activeFileId: number;
  tabToOpenData: { blueprintId: number; variantId: string } | null;
}

export const useFilesStore = defineStore("files", {
  state: (): IState => ({
    ROOT: ".",
    tabs: [],
    activeFileId: 0,
    tabToOpenData: null,
  }),

  getters: {
    activeTab: state =>
      state.tabs.find(
        tab => !!state.activeFileId && tab.file.id === state.activeFileId
      ),
  },

  actions: {
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

    async store(formData: FormData) {
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

    setActiveTab(file: IFileDTO) {
      const tab = this.findTabById(file.id);

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

    async setActiveTabFromBundle(bundle: IBundleFileDTO, blueprintId: number) {
      const { fileId, variantId } = bundle;
      const variantsStore = useVariantsStore();

      const fileTab = this.findTabById(fileId);
      let file = fileTab?.file;
      let isFileAvailable = true;

      if (!file) {
        isFileAvailable = false;

        const filesStore = useFilesStore();

        file = await filesStore.getById(fileId);
      }

      this.setActiveTab(file);

      this.tabToOpenData = { blueprintId, variantId };

      if (isFileAvailable) {
        variantsStore.overwriteActiveInformationIfPossible({
          variant: true,
          blueprint: true,
        });
      }
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
