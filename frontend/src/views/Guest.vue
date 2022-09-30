<template>
  <div class="guest-page page">
    <!-- @TODO -->
    <n-alert title="Oops!" type="info">
      It seems that you are logged in. Do you wish to be redirected to
      <router-link :to="ROUTE_DASHBOARD_NAME">
        <n-button ghost type="tertiary" size="small"> dashboard </n-button>
      </router-link>
      page or
      <router-link :to="ROUTE_DASHBOARD_NAME">
        <n-button ghost type="tertiary" size="small"> signed out </n-button>
      </router-link>
    </n-alert>

    <n-icon :size="200">
      <dot-mark-icon />
    </n-icon>
  </div>
</template>

<script setup lang="ts">
import { NIcon, NAlert, NButton } from "naive-ui";
import { DotMark as DotMarkIcon } from "@vicons/carbon";

import { ROUTE_DASHBOARD_NAME } from "@/assets/constants/routes";
</script>
