<template>
  <n-empty :description="props.title">
    <template #icon>
      <n-icon :component="props.icon" />
    </template>

    <template #extra>
      <slot name="extra" />
    </template>
  </n-empty>
</template>

<script setup lang="ts">
import { NEmpty, NIcon } from "naive-ui";
import { Information as DefaultIcon } from "@vicons/carbon";

const props = defineProps({
  icon: {
    type: Object,
    required: false,
    default: DefaultIcon,
  },

  title: {
    type: String,
    required: true,
  },
});
</script>
