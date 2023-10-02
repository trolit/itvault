<template>
  <div class="loading">
    <n-spin :size="spinSize" />
  </div>
</template>

<script setup lang="ts">
import { NSpin } from "naive-ui";

interface IProps {
  spinSize?: number | "small" | "medium" | "large";
}

withDefaults(defineProps<IProps>(), {
  spinSize: "medium",
});
</script>
