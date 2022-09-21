<template>
  <div class="top-panel">
    <n-grid :cols="3">
      <n-grid-item>
        <n-button strong text type="primary">
          <n-icon size="20">
            <about-icon />
          </n-icon>
        </n-button>
      </n-grid-item>
      <n-grid-item>
        <n-button strong text type="primary">
          <n-icon size="20">
            <help-icon />
          </n-icon>
        </n-button>
      </n-grid-item>
      <n-grid-item>
        <n-button strong text type="primary">
          <n-icon size="20">
            <updates-icon />
          </n-icon>
        </n-button>
      </n-grid-item>
    </n-grid>

    <n-tag>Workspaces</n-tag>
  </div>
</template>

<script setup lang="ts">
import {
  Help as HelpIcon,
  UpdateNow as UpdatesIcon,
  InformationSquare as AboutIcon,
} from "@vicons/carbon";
import { NButton, NIcon, NGrid, NGridItem, NTag } from "naive-ui";
</script>
