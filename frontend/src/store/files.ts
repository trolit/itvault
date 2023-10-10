import axios from "axios";
import { defineStore } from "pinia";

import type { FileTab } from "@/types/FileTab";
import { useWorkspacesStore } from "./workspaces";
import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IBundleFileDto } from "@shared/types/dtos/IBundleFileDto";
import type { IFileVariantDto } from "@shared/types/dtos/IFileVariantDto";

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
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
      };

      const { data } = await axios.get<IFileDto>(`v1/files/${id}`, {
        params,
      });

      return data;
    },

    getAll(options: { blueprintId: number }) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        ...options,
        workspaceId: workspacesStore.activeItem.id,
      };

      return axios.get<IFileVariantDto[]>(`v1/files`, {
        params,
      });
    },

    async store(formData: FormData) {
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
      };

      const { data } = await axios.post<IFileDto[]>("v1/files", formData, {
        params,
      });

      // @NOTE consider replacing upload alert (FilesTab) with manual file structure change

      return data;
    },

    findTabById(id: number) {
      return this.tabs.find(tab => tab.file.id === id);
    },

    newTab(file: IFileDto) {
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

    async newTabFromBundle(bundle: IBundleFileDto, blueprintId: number) {
      const { fileId, variantId } = bundle;

      const fileTab = this.findTabById(fileId);
      let file = fileTab?.file;

      if (!file) {
        const filesStore = useFilesStore();

        file = await filesStore.getById(fileId);
      }

      this.newTab(file);

      this.tabToOpenData = { blueprintId, variantId };
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
