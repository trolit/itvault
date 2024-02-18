<template>
  <div class="panel">
    <n-checkbox
      :checked="activityTabData.isGeneralSeriesVisible"
      @update:checked="$emit('toggle-general-series')"
    >
      General series
    </n-checkbox>

    <n-checkbox v-model:checked="activityTabData.isGridVisible">
      Grid
    </n-checkbox>

    <div>
      <n-text :depth="3"><small>Contributor(s)</small></n-text>

      <asynchronous-select
        multiple
        :disabled="isLoading || isFetchingContributors"
        :value="activeContributorIds"
        :options="contributorsOptions"
        :filterable="false"
        :max-tag-count="1"
        placeholder="Select contributor(s)"
        :loading="isFetchingContributors"
        @update-value="$emit('toggle-contributors', $event)"
      />
    </div>

    <div>
      <n-text :depth="3"><small>Range</small></n-text>

      <time-range-selector
        :disabled="isLoading"
        :option="activityTabData.timeRangeOption"
        :range="rangeInMilliseconds"
        @update-option="activityTabData.timeRangeOption = $event"
        @update-range="onRangeUpdate"
      />
    </div>

    <div>
      <n-text :depth="3"><small>Precision</small></n-text>

      <time-precision-selector
        :disabled="isLoading"
        :option="activityTabData.precision"
        @update-option="$emit('update-precision', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { NText, NCheckbox } from "naive-ui";

import { useGeneralStore } from "@/store/general";
import { useInsightsStore } from "@/store/insights";
import { useWorkspacesStore } from "@/store/workspaces";
import TimeRangeSelector from "@/components/common/TimeRangeSelector.vue";
import AsynchronousSelect from "@/components/common/AsynchronousSelect.vue";
import TimePrecisionSelector from "@/components/common/TimePrecisionSelector.vue";

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

const emits = defineEmits<{
  (event: "update-range"): void;
  (event: "toggle-general-series"): void;
  (event: "update-precision", unit: string): void;
  (event: "toggle-contributors", userIds: number[]): void;
}>();

const generalStore = useGeneralStore();
const insightsStore = useInsightsStore();
const workspacesStore = useWorkspacesStore();

const {
  activityTabData,
  rangeInMilliseconds,
  contributorsOptions,
  activeContributorIds,
} = storeToRefs(insightsStore);
const isFetchingContributors = ref(false);

onBeforeMount(() => {
  if (!insightsStore.contributors.length) {
    fetchContributors();
  }
});

async function fetchContributors() {
  if (isFetchingContributors.value) {
    return;
  }

  isFetchingContributors.value = true;

  try {
    const { data } = await workspacesStore.getContributors();

    insightsStore.contributors = data;
  } catch (error) {
    console.error(error);

    generalStore.messageProvider.error(`Failed to fetch contributors!`);
  } finally {
    isFetchingContributors.value = false;
  }
}

function onRangeUpdate(range: [number, number]) {
  insightsStore.setTimeRange(range);

  emits("update-range");
}
</script>
