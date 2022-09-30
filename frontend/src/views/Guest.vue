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

    <n-grid
      x-gap="20"
      y-gap="20"
      class="grid"
      responsive="screen"
      cols="1 s:1 m:2 l:2 xl:2 2xl:2"
    >
      <n-grid-item> brand </n-grid-item>

      <n-grid-item> short desc </n-grid-item>

      <n-grid-item :span="2">
        <icon :value="DotMarkIcon" :size="200" />

        <icon :value="DotMarkIcon" :size="200" />

        <icon :value="DotMarkIcon" :size="200" />

        <icon :value="DotMarkIcon" :size="200" />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { DotMark as DotMarkIcon } from "@vicons/carbon";
import { NAlert, NButton, NGrid, NGridItem } from "naive-ui";

import Icon from "@/components/common/Icon.vue";
import { ROUTE_DASHBOARD_NAME } from "@/assets/constants/routes";
</script>
