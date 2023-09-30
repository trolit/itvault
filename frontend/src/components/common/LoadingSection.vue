<template>
  <div class="loading">
    <n-spin :size="spinSize || 'medium'" />
  </div>
</template>

<script setup lang="ts">
import { NSpin } from "naive-ui";

defineProps({
  spinSize: {
    type: Number || "small" || "medium" || "large",
    required: false,
  },
});
</script>
