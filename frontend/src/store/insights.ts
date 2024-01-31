import { defineStore } from "pinia";

import type { IUserDTO } from "@shared/types/DTOs/User";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";

interface IState {
  activeKey: string;

  membersTabData: {
    total: number;

    items: IUserDTO[];

    pagination: IPaginationQuery;
  };
}

export const useInsightsStore = defineStore("insights", {
  state: (): IState => ({
    activeKey: "members",

    membersTabData: {
      total: 0,
      items: [],
      pagination: {
        page: 1,
        perPage: 10,
      },
    },
  }),

  getters: {},

  actions: {
    resetState() {
      this.activeKey = "members";

      this.membersTabData = {
        total: 0,
        items: [],
        pagination: { page: 1, perPage: 10 },
      };
    },
  },
});
