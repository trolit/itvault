<template>
  <n-popover
    trigger="click"
    placement="right"
    :disabled="!variantsStore.isActiveTabInWriteMode"
  >
    <template #trigger>
      <span
        :style="{ backgroundColor: color, padding: '3px 0' }"
        :[bucketsStore.LOCATION_ATTRIBUTE_NAME]="part.location.original"
      >
        {{ part.text }}
      </span>
    </template>

    <n-button
      size="medium"
      type="error"
      secondary
      circle
      @click="
        bucketsStore.removeFromValue(part.lineIndex, part.location.original)
      "
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
import { useVariantsStore } from "@/store/variants";
import { Delete as DeleteIcon } from "@vicons/carbon";

const bucketsStore = useBucketsStore();
const variantsStore = useVariantsStore();

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
</script>
