import { defineStore } from "pinia";

import type { IUserDTO } from "@shared/types/DTOs/User";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { IWorkspaceTraceDTO } from "@shared/types/DTOs/Workspace";

interface IState {
  activeKey: string;

  membersTabData: {
    total: number;
    items: IUserDTO[];
    pagination: IPaginationQuery;
  };

  logsTabData: {
    total: number;
    items: IWorkspaceTraceDTO[];
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

    logsTabData: {
      total: 0,
      items: [],
      pagination: {
        page: 1,
        perPage: 15,
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

      this.logsTabData = {
        total: 0,
        items: [],
        pagination: {
          page: 1,
          perPage: 15,
        },
      };
    },
  },
});
