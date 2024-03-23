<template>
  <n-icon>
    <component :is="value" />
  </n-icon>
</template>

<script setup lang="ts">
import { NIcon } from "naive-ui";

defineProps({
  value: {
    type: Object,
    required: true,
  },
});
</script>
