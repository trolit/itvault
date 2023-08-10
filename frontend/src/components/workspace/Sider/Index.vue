<template>
  <div class="sider">
    <n-tabs
      animated
      type="line"
      size="medium"
      justify-content="space-evenly"
      :default-value="defaultTab"
    >
      <n-tab-pane
        :name="key"
        :tab="text"
        v-for="({ key, text, tab }, index) in tabs"
        :key="index"
      >
        <component :is="tab" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from "naive-ui";

import FilesTab from "./FilesTab.vue";
import BlueprintsTab from "./BlueprintsTab.vue";

const tabs = [
  {
    key: "blueprints",
    text: "Blueprints",
    tab: BlueprintsTab,
  },
  {
    key: "files",
    text: "Files",
    tab: FilesTab,
  },
];

const defaultTab = "blueprints";
</script>
