<template>
  <div class="activity-tab">
    <loading-section v-if="isLoading" spin-size="large" />

    <div v-else class="wrapper">
      <panel />

      <n-card bordered class="chart-card">
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
import type { ApexOptions } from "apexcharts";
import { computed, onBeforeMount, ref, type ComputedRef } from "vue";

import Panel from "./Panel.vue";
import { useGeneralStore } from "@/store/general";
import { useInsightsStore } from "@/store/insights";
import { useWorkspacesStore } from "@/store/workspaces";
import { THEME_LIGHT } from "@/assets/constants/themes";
import ApexChart from "@/components/common/ApexChart.vue";
import { DatePrecision } from "@shared/types/enums/DatePrecision";
import LoadingSection from "@/components/common/LoadingSection.vue";

const generalStore = useGeneralStore();
const insightsStore = useInsightsStore();
const workspacesStore = useWorkspacesStore();

const isLoading = ref(false);
const { activityTabData, series, rangeInUtc } = storeToRefs(insightsStore);

onBeforeMount(() => {
  if (!activityTabData.value.commonData.length) {
    insightsStore.setTimeRange();

    fetchAll();
  }
});

async function fetchAll(userId?: number) {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  const [from, to] = rangeInUtc.value;

  try {
    const { data } = await workspacesStore.getTracesSeries({
      from,
      to,
      precision: DatePrecision.Days,
      filters: {},
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
  chart: {
    id: "activity-tab-chart",
    zoom: {
      enabled: false,
    },
  },
}));
</script>
