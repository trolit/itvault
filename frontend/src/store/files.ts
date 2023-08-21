import axios from "axios";
import { defineStore } from "pinia";

import { useWorkspacesStore } from "./workspaces";
import type { IFileDto } from "@shared/types/dtos/IFileDto";

interface IState {
  ROOT: string;
}

export const useFilesStore = defineStore("files", {
  state: (): IState => ({
    ROOT: ".",
  }),

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

      return axios.get<IFileDto[]>(`v1/files`, {
        params,
      });
    },
  },
});
