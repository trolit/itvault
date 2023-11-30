<template>
  <n-config-provider
    inline-theme-disabled
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <n-global-style />

    <n-loading-bar-provider>
      <n-message-provider placement="top-left">
        <app-header v-if="withAppHeader" />

        <n-dialog-provider>
          <app-main :with-app-header="withAppHeader" />
        </n-dialog-provider>
      </n-message-provider>
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
  NDialogProvider,
  NMessageProvider,
  NLoadingBarProvider,
  type GlobalThemeOverrides,
} from "naive-ui";
import { useRoute } from "vue-router";
import { computed, type ComputedRef } from "vue";
import type { BuiltInGlobalTheme } from "naive-ui/es/themes/interface";

import {
  ROUTE_GUEST_NAME,
  ROUTE_LOGIN_NAME,
  ROUTE_SIGN_UP_NAME,
} from "./assets/constants/routes";
import AppMain from "@/components/Main.vue";
import { useGeneralStore } from "@/store/general";
import AppHeader from "@/components/header/Index.vue";
import { darkDimmedTheme } from "@/custom-themes/DarkDimmed";
import { THEME_DARK, THEME_DARK_DIMMED } from "@/assets/constants/themes";

const generalStore = useGeneralStore();

const theme = computed((): BuiltInGlobalTheme | null => {
  switch (generalStore.theme) {
    case THEME_DARK:
      return darkTheme;

    default:
      return null;
  }
});

const themeOverrides = computed((): GlobalThemeOverrides | null => {
  switch (generalStore.theme) {
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
    ![ROUTE_LOGIN_NAME, ROUTE_GUEST_NAME, ROUTE_SIGN_UP_NAME].includes(
      route.name
    )
);
</script>
