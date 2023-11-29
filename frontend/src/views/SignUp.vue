<template>
  <div class="sign-up-page page">
    <theme-selector>
      <template #default>
        <n-button text :focusable="false" class="theme-selector">
          <n-icon :component="RainDropIcon" :size="40" />
        </n-button>
      </template>
    </theme-selector>

    <n-card>
      <n-grid
        x-gap="20"
        y-gap="20"
        responsive="screen"
        cols="1 s:1 m:12 l:12 xl:12 2xl:12"
      >
        <n-grid-item span="6">
          <sign-up-banner />
        </n-grid-item>

        <n-grid-item span="6">
          <sign-up-form />
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { RainDrop as RainDropIcon } from "@vicons/carbon";
import { NCard, NGrid, NGridItem, NIcon, NButton } from "naive-ui";

import SignUpForm from "@/components/users/sign-up/Form.vue";
import SignUpBanner from "@/components/users/sign-up/Banner.vue";
import ThemeSelector from "@/components/common/ThemeSelector.vue";
</script>
