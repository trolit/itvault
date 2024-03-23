import axios from "axios";
import { defineStore } from "pinia";

import { useWorkspacesStore } from "./workspaces";
import type { IMoveFilesDTO } from "@shared/types/DTOs/File";

interface IState {}

export const useDirectoriesStore = defineStore("directories", {
  state: (): IState => ({}),

  getters: {},

  actions: {
    moveFiles(payload: IMoveFilesDTO) {
      const { activeItemId: workspaceId } = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId,
      };

      return axios.post<void>(`v1/directories/move-files`, payload, {
        params,
      });
    },
  },
});
