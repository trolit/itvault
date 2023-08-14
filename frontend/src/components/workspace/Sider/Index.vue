<template>
  <div id="sider" class="sider">
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

    <notes-drawer />
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from "naive-ui";

import FilesTab from "./FilesTab.vue";
import BundlesTab from "./BundlesTab.vue";
import BlueprintsTab from "./BlueprintsTab.vue";
import NotesDrawer from "./NotesDrawer/Index.vue";

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
  {
    key: "bundles",
    text: "Bundles",
    tab: BundlesTab,
  },
];

const defaultTab = "blueprints";
</script>
