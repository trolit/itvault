<template>
  <div class="panel">
    <!-- @TODO select contributors -->

    <time-range-selector
      :option="activityTabData.timeRangeOption"
      :range="range"
      @update-option="onOptionUpdate"
      @update-range="insightsStore.setTimeRange($event)"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useInsightsStore } from "@/store/insights";
import TimeRangeSelector from "@/components/common/TimeRangeSelector.vue";

const insightsStore = useInsightsStore();

const { activityTabData, range } = storeToRefs(insightsStore);

function onOptionUpdate(option: string) {
  activityTabData.value.timeRangeOption = option;
}
</script>
