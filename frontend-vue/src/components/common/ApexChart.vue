<template>
  <vue-apex-charts
    :type="type"
    :options="options"
    :series="series"
    :width="width"
    :height="height"
  />
</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { PairedSeriesPoint } from "@/types/PairedSeriesPoint";

interface IProps {
  type: "line";

  options?: ApexOptions;

  series: { name: string; data: PairedSeriesPoint[] }[];

  width?: string | number;

  height?: string | number;
}

defineProps<IProps>();
</script>
