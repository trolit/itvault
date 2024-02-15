import { defineStore } from "pinia";

import type {
  IWorkspaceTraceDTO,
  IWorkspaceActivityDataPointDTO,
} from "@shared/types/DTOs/Workspace";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { IContributorDTO, IUserDTO } from "@shared/types/DTOs/User";

const DEFAULT_MEMBERS_TAB_DATA = {
  total: 0,
  items: [],
  pagination: { page: 1, perPage: 10 },
};

const DEFAULT_LOGS_TAB_DATA = {
  total: 0,
  items: [],
  pagination: {
    page: 1,
    perPage: 15,
  },
};

const DEFAULT_ACTIVITY_TAB_DATA = {
  from: "",
  to: "",
  commonData: [],
  usersData: [],
};

interface IState {
  activeKey: string;
  contributors: IContributorDTO[];

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
  activityTabData: {
    from: string;
    to: string;
    commonData: IWorkspaceActivityDataPointDTO[];
    usersData: {
      userId: number;
      data: IWorkspaceActivityDataPointDTO[];
    }[];
  };
}

export const useInsightsStore = defineStore("insights", {
  state: (): IState => ({
    activeKey: "members",
    contributors: [],

    membersTabData: { ...DEFAULT_MEMBERS_TAB_DATA },
    logsTabData: { ...DEFAULT_LOGS_TAB_DATA },
    activityTabData: { ...DEFAULT_ACTIVITY_TAB_DATA },
  }),

  getters: {},

  actions: {
    resetState() {
      this.activeKey = "members";

      this.membersTabData = { ...DEFAULT_MEMBERS_TAB_DATA };

      this.logsTabData = { ...DEFAULT_LOGS_TAB_DATA };

      this.activityTabData = { ...DEFAULT_ACTIVITY_TAB_DATA };
    },
  },
});
