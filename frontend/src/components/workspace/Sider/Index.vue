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
        v-for="({ key, text }, index) in tabs"
        :key="index"
      >
        aha
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from "naive-ui";

const tabs = [
  {
    key: "blueprints",
    text: "Blueprints",
  },
  {
    key: "files",
    text: "Files",
  },
];

const defaultTab = "blueprints";
</script>
