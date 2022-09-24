<template>
  <n-page-header class="app-header" :style="{ borderBottom }">
    <div class="logo">
      <router-link
        to="/"
        :style="{ color: isBrandHovered ? textColor : 'inherit' }"
        @mouseenter="isBrandHovered = true"
        @mouseleave="isBrandHovered = false"
      >
        <brand />
      </router-link>
    </div>

    <custom-menu />

    <div class="actions">
      <n-popselect
        :value="theme"
        :options="options"
        label-field="value"
        @update:value="setTheme"
      >
        <n-button
          :bordered="false"
          size="small"
          type="tertiary"
          :focusable="false"
        >
          Theme ({{ theme }})
        </n-button>
      </n-popselect>
    </div>
  </n-page-header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useThemeVars } from "naive-ui";
import { NPopselect, NPageHeader, NButton } from "naive-ui";

import {
  THEME_DARK,
  THEME_LIGHT,
  THEME_DARK_DIMMED,
} from "@/assets/constants/themes";
import CustomMenu from "./Menu.vue";
import Brand from "@/components/common/Brand.vue";
import { usePreferencesStore } from "@/stores/preferences";

const themeVars = useThemeVars();
const preferencesStore = usePreferencesStore();

const options = ref([
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

let isBrandHovered = ref<boolean>(false);

const theme = computed<string>((): string => {
  return preferencesStore.theme;
});

const textColor = computed<string>((): string => {
  return themeVars.value.primaryColor;
});

const borderBottom = computed<string>((): string => {
  return `1px solid ${themeVars.value.borderColor}`;
});

function setTheme(theme: string): void {
  preferencesStore.setTheme(theme);
}
</script>
