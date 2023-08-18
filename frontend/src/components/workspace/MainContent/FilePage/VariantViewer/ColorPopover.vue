<template>
  <n-popover trigger="click" placement="bottom">
    <template #trigger>
      <span :style="{ backgroundColor: props.color, padding: '3px 0' }">
        {{ props.part.text }}
      </span>
    </template>

    <n-button size="medium" type="error" secondary circle>
      <n-icon :size="20" :component="DeleteIcon" />
    </n-button>
  </n-popover>
</template>

<script setup lang="ts">
import { NPopover, NButton, NIcon } from "naive-ui";
import { Delete as DeleteIcon } from "@vicons/carbon";
import type { PropType } from "vue";
import type { LinePart } from "@/types/LinePart";

const props = defineProps({
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
