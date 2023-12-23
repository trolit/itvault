import axios from "axios";
import { defineStore } from "pinia";

import { useWorkspacesStore } from "./workspaces";
import type { IMoveFilesDto } from "@shared/types/dtos/File";

interface IState {}

export const useDirectoriesStore = defineStore("directories", {
  state: (): IState => ({}),

  getters: {},

  actions: {
    moveFiles(payload: IMoveFilesDto) {
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
