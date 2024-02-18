<template>
  <div class="activity-tab">
    <div class="wrapper">
      <panel
        :is-loading="isLoading"
        @update-range="onRangeUpdate"
        @update-precision="onPrecisionUpdate"
        @toggle-contributors="onContributorsToggle"
        @toggle-general-series="onToggleGeneralSeries"
      />

      <n-card bordered class="chart-card">
        <div v-if="isLoading" class="overlay-loader">
          <loading-section spin-size="large" />
        </div>

        <apex-chart
          height="100%"
          type="line"
          :options="options"
          :series="series"
        />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard } from "naive-ui";
import { storeToRefs } from "pinia";
import ApexCharts, { type ApexOptions } from "apexcharts";
import { computed, onBeforeMount, ref, type ComputedRef } from "vue";

import Panel from "./Panel.vue";
import { useGeneralStore } from "@/store/general";
import { useInsightsStore } from "@/store/insights";
import { useWorkspacesStore } from "@/store/workspaces";
import { THEME_LIGHT } from "@/assets/constants/themes";
import ApexChart from "@/components/common/ApexChart.vue";
import { useDateService } from "@/services/useDateService";
import LoadingSection from "@/components/common/LoadingSection.vue";
import type { DatePrecision } from "@shared/types/enums/DatePrecision";

const dateService = useDateService();
const generalStore = useGeneralStore();
const insightsStore = useInsightsStore();
const workspacesStore = useWorkspacesStore();

const isLoading = ref(false);
const { activityTabData, series, activeContributorIds } =
  storeToRefs(insightsStore);

onBeforeMount(() => {
  if (!activityTabData.value.commonData.length) {
    insightsStore.setTimeRange();

    fetchAll();
  }
});

async function fetchAll(userId?: number) {
  isLoading.value = true;

  const { fromInSeconds, toInSeconds, precision } = activityTabData.value;

  try {
    const { data } = await workspacesStore.getTracesSeries({
      from: fromInSeconds,
      to: toInSeconds,
      precision,
      filters: userId ? { userId } : {},
    });

    insightsStore.appendSeriesData({
      data,
      userId,
    });

    // @TMP keep user selections
    activityTabData.value.isGeneralSeriesVisible = true;
  } catch (error) {
    console.error(error);

    generalStore.messageProvider.error(`Failed to fetch requested chart data!`);
  } finally {
    isLoading.value = false;
  }
}

const options: ComputedRef<ApexOptions> = computed(() => ({
  theme: {
    mode: generalStore.theme === THEME_LIGHT ? "light" : "dark",
  },
  tooltip: {
    x: {
      format: insightsStore.currentFormat,
    },
  },
  legend: {
    show: true,
    onItemClick: {
      toggleDataSeries: false,
    },
  },
  stroke: {
    width: 5,
    curve: "smooth",
  },
  fill: {
    type: "solid",
    colors: ["transparent"],
  },
  grid: {
    show: activityTabData.value.isGridVisible,
    strokeDashArray: 2,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      min: 0,
      lines: {
        show: true,
      },
    },
  },
  chart: {
    id: "activity-tab-chart",
    type: "area",
    stacked: false,
    zoom: {
      enabled: false,
    },
  },
  yaxis: {
    min: 0,
    title: {
      text: "Events",
      style: {
        fontWeight: "none",
      },
    },
    labels: {
      formatter(value) {
        return Math.floor(value).toString();
      },
    },
  },
  xaxis: {
    type: "datetime",
    tooltip: {
      enabled: false,
    },
    labels: {
      formatter(value) {
        return dateService.format(value, insightsStore.currentFormat);
      },
    },
  },
}));

function resetChartData() {
  activityTabData.value.commonData = [];
  activityTabData.value.usersData = [];
  activeContributorIds.value = [];
}

function onRangeUpdate() {
  resetChartData();

  fetchAll();
}

function onPrecisionUpdate(precision: string) {
  activityTabData.value.precision = precision as DatePrecision;

  resetChartData();

  fetchAll();
}

function onContributorsToggle(userIds: number[]) {
  const isAddition = userIds.length > activeContributorIds.value.length;
  const latestUserId = userIds[userIds.length - 1];

  if (
    isAddition &&
    !insightsStore.wasContributorDataAlreadyFetched(latestUserId)
  ) {
    fetchAll(latestUserId);
  }

  activeContributorIds.value = userIds;

  for (const item of activityTabData.value.usersData) {
    const seriesName = insightsStore.getSeriesName(item.userId);

    callSeriesAction(
      seriesName,
      activeContributorIds.value.includes(item.userId)
        ? { show: true }
        : { hide: true }
    );
  }
}

function onToggleGeneralSeries(value?: boolean) {
  const show =
    typeof value === "boolean"
      ? value
      : !activityTabData.value.isGeneralSeriesVisible;

  activityTabData.value.isGeneralSeriesVisible = show;

  callSeriesAction(insightsStore.GENERAL_SERIES_NAME, { toggle: true });
}

function callSeriesAction(
  name: string,
  action: { show?: boolean; hide?: boolean; toggle?: boolean }
) {
  const chart = ApexCharts.getChartByID("activity-tab-chart");

  if (!chart) {
    return;
  }

  if (action.show) {
    chart.showSeries(name);

    return;
  }

  if (action.hide) {
    chart.hideSeries(name);

    return;
  }

  if (action.toggle) {
    chart.toggleSeries(name);
  }
}
</script>
