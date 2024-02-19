<template>
  <n-space>
    <n-select
      :value="option"
      :options="options"
      :disabled="disabled"
      :consistent-menu-width="false"
      @update:value="onPredefinedOptionSelect"
    />

    <!-- @TODO investigate if it's possible to limit amount of taken days -->
    <n-date-picker
      v-if="isCustomOptionActive"
      :value="range"
      :disabled="disabled"
      type="datetimerange"
      :default-time="['00:00:00', '23:59:59']"
      @update:value="onRangeSelect"
    />
  </n-space>
</template>

<script setup lang="ts">
import { NSelect, NSpace, NDatePicker } from "naive-ui";

import { useDateService } from "@/services/useDateService";
import type { PrimitiveSelectOption } from "@/types/PrimitiveSelectOption";
import { computed } from "vue";

interface IProps {
  option: string;

  disabled?: boolean;

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

    emits("update-range", dateService.toUnixRange(parseInt(value), unit));
  }

  emits("update-option", option);
}

function onRangeSelect(range: [number, number]) {
  emits("update-range", dateService.rangeToUnix(range));
}

const isCustomOptionActive = computed(() => {
  return props.option === "custom";
});
</script>
