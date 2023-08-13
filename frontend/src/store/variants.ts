import axios from "axios";
import { defineStore } from "pinia";

import { useFilesStore } from "./files";
import { useWorkspacesStore } from "./workspaces";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";

interface IState {
  items: IVariantDto[];
}

export const useVariantsStore = defineStore("variants", {
  state: (): IState => ({
    items: [],
  }),

  actions: {
    async getAll() {
      const filesStore = useFilesStore();
      const workspacesStore = useWorkspacesStore();

      const params = {
        version: 1,
        fileId: filesStore?.activeItem?.id,
        workspaceId: workspacesStore?.activeItem?.id,
      };

      const { data } = await axios.get<IVariantDto[]>("v1/variants", {
        params,
      });

      this.items = data;

      return data;
    },
  },
});
