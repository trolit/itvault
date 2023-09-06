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
import { useGeneralStore } from "@/store/general";
import type { SelectMixedOption } from "naive-ui/es/select/src/interface";

const generalStore = useGeneralStore();

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
  return generalStore.theme;
});

function setTheme(theme: string): void {
  generalStore.setTheme(theme);
}
</script>
