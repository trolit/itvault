<template>
  <div class="loading">
    <n-spin :size="spinSize || 'medium'" />
  </div>
</template>

<script setup lang="ts">
import { NSpin } from "naive-ui";

interface IProps {
  spinSize?: number | "small" | "medium" | "large";
}

defineProps<IProps>();
</script>
