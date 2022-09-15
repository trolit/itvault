<template>
  <n-config-provider inline-theme-disabled :theme="theme">
    <n-global-style />

    <router-view />
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

import { computed } from "vue";
import { RouterView } from "vue-router";
import { darkTheme, NConfigProvider, NGlobalStyle } from "naive-ui";

import { THEME_DARK } from "@/assets/constants/themes";
import { usePreferencesStore } from "@/stores/preferences";
import type { BuiltInGlobalTheme } from "naive-ui/es/themes/interface";

const preferencesStore = usePreferencesStore();

const theme = computed((): BuiltInGlobalTheme | null => {
  switch (preferencesStore.theme) {
    case THEME_DARK:
      return darkTheme;

    default:
      return null;
  }
});
</script>
