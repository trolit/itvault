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

import { DARK_THEME } from "@/assets/constants/themes";
import { usePreferencesStore } from "@/stores/preferences";

const preferencesStore = usePreferencesStore();

const theme = computed(() => {
  return preferencesStore.theme === DARK_THEME ? darkTheme : null;
});
</script>
