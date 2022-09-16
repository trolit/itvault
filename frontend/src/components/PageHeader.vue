<template>
  <n-page-header class="page-header">
    <div class="content">
      <div class="label">
        <n-icon>
          <development />
        </n-icon>

        <span>itvault</span>
      </div>

      <div class="actions">
        <n-popselect
          :value="theme"
          :options="options"
          label-field="value"
          @update:value="setTheme"
        >
          <n-button size="small" type="tertiary" :focusable="false">
            Theme ({{ theme }})
          </n-button>
        </n-popselect>
      </div>
    </div>
  </n-page-header>
</template>

<script setup lang="ts">
import { Development } from "@vicons/carbon";
import { NPopselect, NIcon, NPageHeader, NButton } from "naive-ui";

import { ref, computed } from "vue";
import { usePreferencesStore } from "@/stores/preferences";
import { THEME_DARK, THEME_LIGHT } from "@/assets/constants/themes";

const preferencesStore = usePreferencesStore();

const theme = computed<string>((): string => {
  return preferencesStore.theme;
});

function setTheme(theme: string): void {
  preferencesStore.setTheme(theme);
}

const options = ref([
  {
    value: THEME_DARK,
  },
  {
    value: THEME_LIGHT,
  },
]);
</script>
