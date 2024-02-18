<template>
  <div class="panel">
    <div>
      <n-text :depth="3"><small>Contributor(s)</small></n-text>

      <asynchronous-select
        multiple
        :value="activeContributorIds"
        :options="contributorsOptions"
        :filterable="false"
        :max-tag-count="1"
        placeholder="Select contributor(s)"
        :loading="isLoadingContributors"
        @update-value="$emit('toggle-contributors', $event)"
      />
    </div>

    <div>
      <n-text :depth="3"><small>Range</small></n-text>

      <time-range-selector
        :option="activityTabData.timeRangeOption"
        :range="rangeInMilliseconds"
        @update-option="activityTabData.timeRangeOption = $event"
        @update-range="onUpdateRange"
      />
    </div>

    <div>
      <n-text :depth="3"><small>Precision</small></n-text>

      <time-precision-selector
        :option="activityTabData.precision"
        @update-option="$emit('update-precision', $event)"
      />
    </div>

    <!-- @TODO add option to hide grid -->

    <!-- @TODO add option to hide legend -->
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { NText } from "naive-ui";

import { useGeneralStore } from "@/store/general";
import { useInsightsStore } from "@/store/insights";
import { useWorkspacesStore } from "@/store/workspaces";
import TimeRangeSelector from "@/components/common/TimeRangeSelector.vue";
import AsynchronousSelect from "@/components/common/AsynchronousSelect.vue";
import TimePrecisionSelector from "@/components/common/TimePrecisionSelector.vue";

const emits = defineEmits<{
  (event: "update-range"): void;
  (event: "update-precision", unit: string): void;
  (event: "toggle-contributors", userIds: number[]): void;
}>();

const generalStore = useGeneralStore();
const insightsStore = useInsightsStore();
const workspacesStore = useWorkspacesStore();

const isLoadingContributors = ref(false);
const {
  activityTabData,
  rangeInMilliseconds,
  contributorsOptions,
  activeContributorIds,
} = storeToRefs(insightsStore);

onBeforeMount(() => {
  if (!insightsStore.contributors.length) {
    fetchContributors();
  }
});

function onUpdateRange(range: [number, number]) {
  insightsStore.setTimeRange(range);

  emits("update-range");
}

async function fetchContributors() {
  if (isLoadingContributors.value) {
    return;
  }

  isLoadingContributors.value = true;

  try {
    const { data } = await workspacesStore.getContributors();

    insightsStore.contributors = data;
  } catch (error) {
    console.error(error);

    generalStore.messageProvider.error(`Failed to fetch contributors!`);
  } finally {
    isLoadingContributors.value = false;
  }
}
</script>
