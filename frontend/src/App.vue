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
import { computed, type ComputedRef } from "vue";
import { RouterView, useRoute } from "vue-router";
import type { BuiltInGlobalTheme } from "naive-ui/es/themes/interface";

import AppHeader from "@/components/header/Index.vue";
import { usePreferencesStore } from "@/stores/preferences";
import { darkDimmedTheme } from "@/custom-themes/DarkDimmed";
import { THEME_DARK, THEME_DARK_DIMMED } from "@/assets/constants/themes";
import { ROUTE_GUEST_NAME, ROUTE_LOGIN_NAME } from "./assets/constants/routes";

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

const withAppHeader: ComputedRef<boolean> = computed(
  (): boolean =>
    route &&
    typeof route.name === "string" &&
    ![ROUTE_LOGIN_NAME, ROUTE_GUEST_NAME].includes(route.name)
);
</script>
