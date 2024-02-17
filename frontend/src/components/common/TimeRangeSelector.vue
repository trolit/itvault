<template>
  <n-element>
    <n-select
      :value="option"
      :options="options"
      @update:value="onPredefinedOptionSelect"
    />

    <n-date-picker
      v-if="isCustomOptionActive"
      :value="range"
      type="datetimerange"
      :default-time="['00:00:00', '23:59:59']"
      @update:value="$emit('update-range', $event)"
    />
  </n-element>
</template>

<script setup lang="ts">
import { NSelect, NElement, NDatePicker } from "naive-ui";

import { useDateService } from "@/services/useDateService";
import type { PrimitiveSelectOption } from "@/types/PrimitiveSelectOption";
import { computed } from "vue";

interface IProps {
  option: string;

  range: [number, number];
}

const props = defineProps<IProps>();

const emits = defineEmits<{
  (event: "update-option", option: string): void;

  (event: "update-range", data: [number, number]): void;
}>();

const dateService = useDateService();

const options: PrimitiveSelectOption[] = [
  {
    label: "Last 3 days",
    value: "days-3",
  },
  {
    label: "Last 7 days",
    value: "days-7",
  },
  {
    label: "Last 30 days",
    value: "days-30",
  },
  {
    label: "Last 60 days",
    value: "days-60",
  },
  {
    label: "Last 90 days",
    value: "days-90",
  },
  {
    label: "Custom",
    value: "custom",
  },
];

function onPredefinedOptionSelect(option: string) {
  if (option !== "custom") {
    const [unit, value] = option.split("-");

    emits("update-range", dateService.unixRange(parseInt(value), unit));
  }

  emits("update-option", option);
}

const isCustomOptionActive = computed(() => {
  return props.option === "custom";
});
</script>
