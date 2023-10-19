<template>
  <n-select
    :value="value"
    :options="options"
    :reset-menu-on-options-change="false"
    @scroll="handleScroll"
    @update-show="onUpdateShow"
    @update-value="$emit('select', $event)"
  />
</template>

<script setup lang="ts">
import { NSelect } from "naive-ui";

import type { PrimitiveSelectOption } from "@/types/PrimitiveSelectOption";

interface IProps {
  value: string | number | null;

  options: PrimitiveSelectOption[];
}

const props = defineProps<IProps>();

const emit = defineEmits(["scroll", "select", "init"]);

function onUpdateShow(value: boolean) {
  if (value && !props.options.length) {
    emit("init");
  }
}

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
