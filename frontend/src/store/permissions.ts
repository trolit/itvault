import axios from "axios";
import { defineStore } from "pinia";

import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { IPermissionDto } from "@shared/types/dtos/IPermissionDto";

interface IState {
  items: IPermissionDto[];
}

export const usePermissionsStore = defineStore("permissions", {
  state: (): IState => ({
    items: [],
  }),

  getters: {},

  actions: {
    async getAll(options: IPaginationQuery) {
      const params = {
        version: 1,
        ...options,
      };

      const { data } = await axios.get<IPermissionDto[]>(`v1/permissions`, {
        params,
      });

      this.items = data;

      return data;
    },
  },
});
