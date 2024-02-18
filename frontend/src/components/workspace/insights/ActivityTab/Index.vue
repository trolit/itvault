<template>
  <div class="activity-tab">
    <div class="wrapper">
      <panel
        @update-range="onRangeUpdate"
        @update-precision="onPrecisionUpdate"
        @toggle-contributors="onContributorsToggle"
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
          @legend-click="onLegendClick"
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
import LoadingSection from "@/components/common/LoadingSection.vue";
import type { DatePrecision } from "@shared/types/enums/DatePrecision";

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
  // tooltip: {
  //   x: {
  //     format: "dd MMM",
  //   },
  // },
  legend: {
    show: true,
    showForSingleSeries: true,
    position: "left",
  },
  stroke: {
    show: true,
    curve: "smooth",
    lineCap: "square",
    colors: undefined,
    width: 3,
    dashArray: 0,
  },
  grid: {
    show: true,
    borderColor: "#90A4AE",
    strokeDashArray: 2,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
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
  // xaxis: {
  //   type: "datetime",
  //   labels: {
  //     datetimeFormatter: {
  //       year: "yyyy",
  //       month: "MMM 'yy",
  //       day: "dd MMM",
  //       hour: "HH:mm",
  //     },
  //   },
  // },
}));

function onLegendClick(chart: ApexCharts, seriesIndex: number) {
  if (seriesIndex === 0) {
    return;
  }

  insightsStore.onLegendClick(seriesIndex);
}

function onRangeUpdate() {
  activityTabData.value.commonData = [];
  activityTabData.value.usersData = [];
  activeContributorIds.value = [];

  fetchAll();
}

function onPrecisionUpdate(precision: string) {
  activityTabData.value.precision = precision as DatePrecision;

  activityTabData.value.commonData = [];
  activityTabData.value.usersData = [];
  activeContributorIds.value = [];

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

  insightsStore.activeContributorIds = userIds;

  for (const item of activityTabData.value.usersData) {
    const seriesName = insightsStore.getSeriesName(item.userId);

    toggleSeries(seriesName);
  }
}

function toggleSeries(seriesName: string) {
  const chart = ApexCharts.getChartByID("activity-tab-chart");

  if (chart) {
    chart.toggleSeries(seriesName);
  }
}
</script>
