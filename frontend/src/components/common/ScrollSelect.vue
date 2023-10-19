<template>
  <n-select
    :value="value"
    :options="options"
    :reset-menu-on-options-change="false"
    @scroll="handleScroll"
    @update-value="$emit('select', $event)"
  />
</template>

<script setup lang="ts">
import { NSelect } from "naive-ui";

interface IProps {
  value: string | number;

  options?: { label: string; value: string | number }[];
}

defineProps<IProps>();

const emit = defineEmits(["scroll", "select"]);

function handleScroll(event: Event) {
  const currentTarget = event.currentTarget as HTMLElement;

  if (
    currentTarget.scrollTop + currentTarget.offsetHeight >=
    currentTarget.scrollHeight
  ) {
    emit("scroll");
  }
}
</script>
