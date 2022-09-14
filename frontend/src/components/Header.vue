<template>
  <n-page-header>
    <div class="content">
      <div class="label">
        <n-icon>
          <development />
        </n-icon>

        <span>itvault</span>
      </div>

      <div class="actions">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              text
              size="small"
              type="tertiary"
              :focusable="false"
              @click="switchTheme"
            >
              <n-icon size="20">
                <color-switch />
              </n-icon>
            </n-button>
          </template>

          Theme
        </n-tooltip>
      </div>
    </div>
  </n-page-header>
</template>

<script setup lang="ts">
import { ColorSwitch, Development } from "@vicons/carbon";
import { NIcon, NPageHeader, NButton, NTooltip } from "naive-ui";

import { usePreferencesStore } from "@/stores/preferences";

const preferencesStore = usePreferencesStore();

function switchTheme() {
  preferencesStore.toggleTheme();
}
</script>
