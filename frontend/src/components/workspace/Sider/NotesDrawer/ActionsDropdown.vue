<template>
  <n-dropdown trigger="hover" :options="options" :width="250">
    <n-button text>
      <n-icon :size="25" :component="GearIcon" />
    </n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import { h, ref } from "vue";
import { NDropdown, NIcon, NButton, NText } from "naive-ui";
import { OperationsField as GearIcon } from "@vicons/carbon";

const options = ref([
  {
    label: "Update",
    key: "update",
  },
  {
    key: "update-any",
    label: () =>
      h(NText, { depth: 2, type: "info" }, { default: () => "Update (any)" }),
  },
  {
    key: "delete",
    label: () =>
      h(NText, { depth: 2, type: "error" }, { default: () => "Delete" }),
  },
]);
</script>
