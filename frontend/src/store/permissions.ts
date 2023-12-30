import axios from "axios";
import { defineStore } from "pinia";

import type { IPermissionDTO } from "@shared/types/DTOs/Permission";

interface IState {
  items: IPermissionDTO[];
}

export const usePermissionsStore = defineStore("permissions", {
  state: (): IState => ({
    items: [],
  }),

  getters: {},

  actions: {
    async getAll() {
      const params = {
        version: 1,
      };

      const { data } = await axios.get<IPermissionDTO[]>(`v1/permissions`, {
        params,
      });

      this.items = data;

      return data;
    },
  },
});
