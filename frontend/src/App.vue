<template>
  <n-config-provider
    inline-theme-disabled
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <n-global-style />

    <n-loading-bar-provider>
      <router-view />
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
// ***********************************************************************
// *
// * Itvault
// * 09.2022
// * https://github.com/trolit/itvault/
// *
// ***********************************************************************

import {
  darkTheme,
  NGlobalStyle,
  NConfigProvider,
  NLoadingBarProvider,
  type GlobalThemeOverrides,
} from "naive-ui";
import { computed } from "vue";
import { RouterView } from "vue-router";

import { usePreferencesStore } from "@/stores/preferences";
import { darkDimmedTheme } from "@/custom-themes/DarkDimmed";
import type { BuiltInGlobalTheme } from "naive-ui/es/themes/interface";
import { THEME_DARK, THEME_DARK_DIMMED } from "@/assets/constants/themes";

const preferencesStore = usePreferencesStore();

const theme = computed((): BuiltInGlobalTheme | null => {
  switch (preferencesStore.theme) {
    case THEME_DARK:
      return darkTheme;

    default:
      return null;
  }
});

const themeOverrides = computed((): GlobalThemeOverrides | null => {
  switch (preferencesStore.theme) {
    case THEME_DARK_DIMMED:
      return darkDimmedTheme;

    default:
      return null;
  }
});
</script>
