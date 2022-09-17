<template>
  <n-page-header class="page-header">
    <div class="content">
      <div class="brand">
        <router-link
          to="/"
          :style="{ color: isBrandHovered ? textColor : 'inherit' }"
          @mouseenter="isBrandHovered = true"
          @mouseleave="isBrandHovered = false"
        >
          <brand />
        </router-link>
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
import { ref, computed } from "vue";
import { useThemeVars } from "naive-ui";
import { NPopselect, NPageHeader, NButton } from "naive-ui";

import Brand from "@/components/common/Brand.vue";
import { usePreferencesStore } from "@/stores/preferences";
import { THEME_DARK, THEME_LIGHT } from "@/assets/constants/themes";

const preferencesStore = usePreferencesStore();

const options = ref([
  {
    value: THEME_DARK,
  },
  {
    value: THEME_LIGHT,
  },
]);

let isBrandHovered = ref<boolean>(false);

const theme = computed<string>((): string => {
  return preferencesStore.theme;
});

const textColor = computed<string>((): string => {
  return useThemeVars().value.successColorHover;
});

function setTheme(theme: string): void {
  preferencesStore.setTheme(theme);
}
</script>
