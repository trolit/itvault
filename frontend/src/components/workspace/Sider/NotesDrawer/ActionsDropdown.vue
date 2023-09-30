<template>
  <n-dropdown trigger="hover" :options="[]" :width="250">
    <n-icon :component="GearIcon" />
  </n-dropdown>
</template>

<script setup lang="ts">
import { NDropdown, NIcon } from "naive-ui";
import { OperationsField as GearIcon } from "@vicons/carbon";
</script>
