import { defineStore } from "pinia";

import type {
  IWorkspaceTraceDTO,
  IWorkspaceActivityDataPointDTO,
} from "@shared/types/DTOs/Workspace";
import { useDateService } from "@/services/useDateService";
import { DatePrecision } from "@shared/types/enums/DatePrecision";
import type { PairedSeriesPoint } from "@/types/PairedSeriesPoint";
import type { IPaginationQuery } from "@shared/types/IPaginationQuery";
import type { IContributorDTO, IUserDTO } from "@shared/types/DTOs/User";
import type { PrimitiveSelectOption } from "@/types/PrimitiveSelectOption";

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
  isGeneralSeriesVisible: true,
  isGridVisible: true,
  timeRangeOption: "days-30",
  precision: DatePrecision.Days,
  fromInSeconds: 0,
  toInSeconds: 0,
  commonData: [],
  usersData: [],
};

interface IState {
  activeKey: string;
  contributors: IContributorDTO[];
  activeContributorIds: number[];

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
    isGeneralSeriesVisible: boolean;
    isGridVisible: boolean;
    timeRangeOption: string;
    precision: DatePrecision;
    fromInSeconds: number;
    toInSeconds: number;
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
    activeContributorIds: [],

    membersTabData: { ...DEFAULT_MEMBERS_TAB_DATA },
    logsTabData: { ...DEFAULT_LOGS_TAB_DATA },
    activityTabData: { ...DEFAULT_ACTIVITY_TAB_DATA },
  }),

  getters: {
    GENERAL_SERIES_NAME: () => "General",
    contributorsOptions(): PrimitiveSelectOption[] {
      return this.contributors.map(contributor => ({
        label: contributor.fullName,
        value: contributor.id,
      }));
    },
    series(): {
      name: string;
      data: PairedSeriesPoint<string, number>[];
    }[] {
      const { commonData, usersData } = this.activityTabData;

      const result = [
        {
          name: this.GENERAL_SERIES_NAME,
          data: commonData,
        },
      ];

      for (const userData of usersData) {
        const user = this.contributors.find(
          user => user.id === userData.userId
        );

        result.push({
          name: user ? `${user.fullName}` : "unknown",
          data: userData.data,
        });
      }

      return result;
    },
    rangeInMilliseconds(): [number, number] {
      const { fromInSeconds, toInSeconds } = this.activityTabData;

      return [fromInSeconds * 1000, toInSeconds * 1000];
    },
    currentFormat(): string {
      const baseFormat = `D.MM`;

      switch (this.activityTabData.precision) {
        case DatePrecision.Minutes:
          return `${baseFormat} HH:mm`;
        case DatePrecision.Hours:
          return `${baseFormat} Ha`;
        case DatePrecision.Days:
          return `${baseFormat}`;
        case DatePrecision.Months:
          return `MMM YYYY`;
      }
    },
  },

  actions: {
    getSeriesName(userId: number) {
      const user = this.contributors.find(user => user.id === userId);

      return user ? `${user.fullName}` : "unknown";
    },

    resetState() {
      this.activeKey = "members";

      this.membersTabData = { ...DEFAULT_MEMBERS_TAB_DATA };

      this.logsTabData = { ...DEFAULT_LOGS_TAB_DATA };

      this.activityTabData = { ...DEFAULT_ACTIVITY_TAB_DATA };
    },

    wasContributorDataAlreadyFetched(userId: number) {
      return !!this.activityTabData.usersData.find(
        data => data.userId === userId
      );
    },

    setTimeRange(range?: [number, number]) {
      let from = 0;
      let to = 0;

      const dateService = useDateService();

      if (Array.isArray(range)) {
        from = range[0];
        to = range[1];
      } else {
        const [unit, amount] = this.activityTabData.timeRangeOption.split("-");
        const result = dateService.toUnixRange(parseInt(amount), unit);

        from = result[0];
        to = result[1];
      }

      this.activityTabData.fromInSeconds = from;
      this.activityTabData.toInSeconds = to;
    },

    appendSeriesData(arg: {
      data: IWorkspaceActivityDataPointDTO[];
      userId?: number;
    }) {
      const { data, userId } = arg;

      if (userId) {
        this.activityTabData.usersData.push({
          userId,
          data,
        });

        return;
      }

      this.activityTabData.commonData = data;
    },
  },
});
