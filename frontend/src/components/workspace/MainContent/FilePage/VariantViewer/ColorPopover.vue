<template>
  <n-popover trigger="click" placement="bottom">
    <template #trigger>
      <span :style="{ backgroundColor: color, padding: '3px 0' }">
        {{ part.text }}
      </span>
    </template>

    <n-button
      size="medium"
      type="error"
      secondary
      circle
      @click="bucketsStore.removeActiveBucketPart(part)"
    >
      <n-icon :size="20" :component="DeleteIcon" />
    </n-button>
  </n-popover>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { NPopover, NButton, NIcon } from "naive-ui";

import type { LinePart } from "@/types/LinePart";
import { useBucketsStore } from "@/store/buckets";
import { Delete as DeleteIcon } from "@vicons/carbon";

defineProps({
  color: {
    type: String,
    required: true,
  },

  part: {
    type: Object as PropType<LinePart>,
    required: true,
  },
});

const bucketsStore = useBucketsStore();
</script>
