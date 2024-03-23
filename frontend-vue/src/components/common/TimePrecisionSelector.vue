<template>
  <n-select
    :value="option"
    :options="options"
    :consistent-menu-width="false"
    @update:value="$emit('update-option', $event)"
  />
</template>

<script setup lang="ts">
import { NSelect } from "naive-ui";

import type { PrimitiveSelectOption } from "@/types/PrimitiveSelectOption";
import { DatePrecision } from "@shared/types/enums/DatePrecision";

interface IProps {
  option: string;
}

defineProps<IProps>();

defineEmits<{
  (event: "update-option", option: string): void;
}>();

const options: PrimitiveSelectOption[] = [
  {
    label: "minutes",
    value: DatePrecision.Minutes,
  },
  {
    label: "hours",
    value: DatePrecision.Hours,
  },
  {
    label: "days",
    value: DatePrecision.Days,
  },
  {
    label: "months",
    value: DatePrecision.Months,
  },
];
</script>
