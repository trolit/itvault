<template>
  <div class="loading">
    <n-spin :size="spinSize || 'medium'" />
  </div>
</template>

<script setup lang="ts">
import { NSpin } from "naive-ui";
import type { PropType } from "vue";

defineProps({
  spinSize: {
    type: Object as PropType<number | "small" | "medium" | "large">,
    required: false,
  },
});
</script>
