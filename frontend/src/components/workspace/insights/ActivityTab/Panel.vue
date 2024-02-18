<template>
  <div class="panel">
    <!-- @TODO select contributors -->

    <time-range-selector
      :option="activityTabData.timeRangeOption"
      :range="rangeInMilliseconds"
      @update-option="activityTabData.timeRangeOption = $event"
      @update-range="onUpdateRange"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useInsightsStore } from "@/store/insights";
import TimeRangeSelector from "@/components/common/TimeRangeSelector.vue";

const emits = defineEmits<{
  (event: "update-range"): void;
}>();

const insightsStore = useInsightsStore();

const { activityTabData, rangeInMilliseconds } = storeToRefs(insightsStore);

function onUpdateRange(range: [number, number]) {
  insightsStore.setTimeRange(range);

  emits("update-range");
}
</script>
