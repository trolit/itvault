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
import { ref, computed, type ComputedRef, type Ref } from "vue";

import {
  THEME_DARK,
  THEME_LIGHT,
  THEME_DARK_DIMMED,
} from "@/assets/constants/themes";
import { usePreferencesStore } from "@/store/preferences";
import type { SelectMixedOption } from "naive-ui/es/select/src/interface";

const preferencesStore = usePreferencesStore();

const options: Ref<SelectMixedOption[]> = ref([
  {
    value: THEME_DARK,
  },
  {
    value: THEME_LIGHT,
  },
  {
    value: THEME_DARK_DIMMED,
  },
]);

const theme: ComputedRef<string> = computed((): string => {
  return preferencesStore.theme;
});

function setTheme(theme: string): void {
  preferencesStore.setTheme(theme);
}
</script>
