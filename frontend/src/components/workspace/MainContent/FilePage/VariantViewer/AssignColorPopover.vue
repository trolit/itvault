<template>
  <n-popover :show="isVisible" :x="x" :y="y" trigger="manual" placement="right">
    <n-button
      size="medium"
      type="success"
      secondary
      circle
      @click="bucketsStore.colorActiveBucketPart(selectionData)"
    >
      <n-icon :size="20" :component="AddIcon" />
    </n-button>
  </n-popover>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { PaintBrush as AddIcon } from "@vicons/carbon";
import { NPopover, NButton, NIcon } from "naive-ui";

import { useBucketsStore } from "@/store/buckets";

defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },

  x: {
    type: Number,
    required: true,
  },

  y: {
    type: Number,
    required: true,
  },

  selectionData: {
    type: Object as PropType<{
      startLineIndex: number;
      endLineIndex: number;

      anchorChildrenIndex: number;
      focusChildrenIndex: number;

      anchorOffset: number;
      focusOffset: number;
    }>,
    required: true,
  },
});

const bucketsStore = useBucketsStore();
</script>
