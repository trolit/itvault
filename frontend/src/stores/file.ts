import axios from "axios";
import { defineStore } from "pinia";

import { useWorkspacesStore } from "./workspace";
import type { IFileDto } from "@shared/types/dtos/IFileDto";

interface IState {
  items: IFileDto[];
}

export const useFilesStore = defineStore("files", {
  state: (): IState => ({
    items: [],
  }),

  actions: {
    async getAllBy(query: { blueprintId?: number; relativePath?: string }) {
      const { blueprintId, relativePath } = query;

      if ((blueprintId && relativePath) || (!blueprintId && !relativePath)) {
        console.error("Use one of query options!");

        return;
      }

      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        workspaceId: workspacesStore.activeItem.id,
      };

      if (blueprintId) {
        (params as any)["blueprintId"] = blueprintId;
      }

      if (relativePath) {
        (params as any)["relativePath"] = relativePath;
      }

      const { data } = await axios.get<IFileDto[]>("v1/files", {
        params,
      });

      this.items = Array.prototype.concat(this.items, data);

      return data;
    },
  },
});
