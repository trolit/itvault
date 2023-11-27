<template>
  <div class="guest-page page">
    <theme-selector>
      <template #default>
        <n-button text :focusable="false" class="theme-selector">
          <icon :value="RainDropIcon" :size="40" />
        </n-button>
      </template>
    </theme-selector>

    <n-grid
      :x-gap="50"
      class="grid"
      responsive="screen"
      cols="1 s:1 m:4 l:4 xl:4 2xl:4"
    >
      <n-grid-item class="header-grid-item" :span="4">
        <div class="title">COMPANY_NAME</div>

        <div class="subtitle">
          <n-icon :component="ArchiveIcon" />

          <span>/vault</span>
        </div>
      </n-grid-item>

      <n-grid-item class="quote-grid-item" :span="4">
        <div class="wrapper">
          <div class="text"><em>Memory is the mother of all wisdom.</em></div>

          <div class="author">-Aeschylus</div>
        </div>
      </n-grid-item>

      <n-grid-item class="button-grid-item" :span="4">
        <router-link :to="ROUTE_LOGIN_NAME">
          <n-button type="info" secondary :focusable="false"> launch </n-button>
        </router-link>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import {
  Archive as ArchiveIcon,
  RainDrop as RainDropIcon,
} from "@vicons/carbon";
import { NGrid, NIcon, NButton, NGridItem } from "naive-ui";

import Icon from "@/components/common/Icon.vue";
import { ROUTE_LOGIN_NAME } from "@/assets/constants/routes";
import ThemeSelector from "@/components/common/ThemeSelector.vue";
</script>
