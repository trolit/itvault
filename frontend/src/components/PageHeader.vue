<template>
  <n-page-header class="page-header">
    <div class="content">
      <brand />

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
import { ref, computed } from "vue";
import { NPopselect, NPageHeader, NButton } from "naive-ui";

import Brand from "@/components/common/Brand.vue";
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
