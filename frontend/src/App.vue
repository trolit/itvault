<template>
  <n-config-provider
    inline-theme-disabled
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <n-global-style />

    <n-loading-bar-provider>
      <app-header v-if="withAppHeader" />

      <main :class="{ 'with-app-header': withAppHeader }">
        <n-scrollbar>
          <router-view />
        </n-scrollbar>
      </main>
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
  NScrollbar,
  NGlobalStyle,
  NConfigProvider,
  NLoadingBarProvider,
  type GlobalThemeOverrides,
} from "naive-ui";
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";

import { usePreferencesStore } from "@/stores/preferences";
import { darkDimmedTheme } from "@/custom-themes/DarkDimmed";
import type { BuiltInGlobalTheme } from "naive-ui/es/themes/interface";
import { THEME_DARK, THEME_DARK_DIMMED } from "@/assets/constants/themes";

import AppHeader from "@/components/header/Index.vue";
import { ROUTE_LOGIN_NAME } from "./assets/constants/routes";

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

const route = useRoute();

const withAppHeader = computed(() => route.name !== ROUTE_LOGIN_NAME);
</script>
