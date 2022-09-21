<template>
  <div class="sidebar">
    <top-panel />

    <n-scrollbar>
      <workspace-menu />
    </n-scrollbar>

    <bottom-panel />
  </div>
</template>

<script setup lang="ts">
import { NScrollbar } from "naive-ui";

import TopPanel from "./TopPanel.vue";
import WorkspaceMenu from "./Menu.vue";
import BottomPanel from "./BottomPanel.vue";
</script>
