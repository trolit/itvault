<template>
  <n-select
    remote
    show-checkmark
    filterable
    :consistent-menu-width="false"
    :value="fixedValue"
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

const { fixedValue } = defineComputed({
  fixedValue() {
    const option = props.options.find(option => option.label === props.value);

    return option ? option.value : props.value;
  },
});

function onSelect(value: string | number) {
  if (fixedValue.value === value) {
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
