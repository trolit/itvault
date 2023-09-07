<template>
  <n-popselect
    :value="theme"
    :options="options"
    label-field="value"
    @update:value="setTheme"
  >
    <slot name="default">
      <n-button
        size="small"
        type="tertiary"
        :bordered="false"
        :focusable="false"
      >
        Theme ({{ theme }})
      </n-button>
    </slot>
  </n-popselect>
</template>

<script setup lang="ts">
import { NButton, NPopselect } from "naive-ui";
import { computed, type ComputedRef } from "vue";

import { useGeneralStore } from "@/store/general";
import { ALL_THEMES } from "@/assets/constants/themes";
import type { SelectMixedOption } from "naive-ui/es/select/src/interface";

const generalStore = useGeneralStore();

const options: SelectMixedOption[] = ALL_THEMES.map(theme => ({
  value: theme,
}));

const theme: ComputedRef<string> = computed((): string => {
  return generalStore.theme;
});

function setTheme(theme: string): void {
  generalStore.setTheme(theme);
}
</script>
