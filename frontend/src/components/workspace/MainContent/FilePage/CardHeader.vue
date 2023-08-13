<template>
  <!-- @TODO notes drawer -->
  <!-- @TODO overflow: auto for timeline! -->
  <div class="card-header">
    <div class="timeline-wrapper" style="overflow: auto">
      <n-timeline v-if="!isLoading" horizontal>
        <n-timeline-item
          v-for="({ id, name, createdAt, size }, index) in variantsStore.items"
          :key="index"
        >
          <template #default>
            <n-button @click="variantsStore.newVariantTab(id)">
              {{ name }}
            </n-button>

            <div>
              <small>{{ formatDate(createdAt) }}</small>
            </div>

            <n-gradient-text type="warning" :size="12">
              ({{ size.value }}{{ size.unit }})
            </n-gradient-text>
          </template>
        </n-timeline-item>

        <n-timeline-item>
          <template #default>
            <n-button type="info" dashed>
              <n-icon :component="AddIcon" :size="25" />
            </n-button>
          </template>
        </n-timeline-item>
      </n-timeline>

      <n-spin v-else size="medium" />
    </div>

    <div class="actions">
      <n-button>Notes</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { Add as AddIcon } from "@vicons/carbon";
import {
  NButton,
  NTimeline,
  NTimelineItem,
  NIcon,
  NSpin,
  NGradientText,
} from "naive-ui";

import { useVariantsStore } from "@/store/variants";
import formatDate from "@/helpers/dayjs/formatDate";

const isLoading = ref(false);
const variantsStore = useVariantsStore();

onBeforeMount(async () => {
  await fetchVariants();
});

async function fetchVariants() {
  isLoading.value = true;

  try {
    await variantsStore.getAll();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
