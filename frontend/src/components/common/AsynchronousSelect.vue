<template>
  <n-select
    remote
    show-checkmark
    filterable
    :value="trueValue"
    :options="options"
    :reset-menu-on-options-change="false"
    @search="onSearch"
    @update-value="onSelect"
    @update-show="onUpdateShow"
  />
</template>

<script setup lang="ts">
import { NSelect } from "naive-ui";

import { defineComputed } from "@/helpers/defineComputed";
import type { PrimitiveSelectOption } from "@/types/PrimitiveSelectOption";

interface IProps {
  value: string | number | null;

  options: PrimitiveSelectOption[];
}

const props = defineProps<IProps>();

const emit = defineEmits(["select", "init", "filter"]);

const { trueValue } = defineComputed({
  trueValue() {
    const option = props.options.find(option => option.label === props.value);

    return option ? option.value : props.value;
  },
});

function onSelect(value: string | number) {
  if (value === props.value) {
    return;
  }

  emit("select", value);
}

function onUpdateShow(value: boolean) {
  if (value && !props.options.length) {
    emit("init");
  }
}

function onSearch(value: string) {
  emit("filter", value);
}
</script>
