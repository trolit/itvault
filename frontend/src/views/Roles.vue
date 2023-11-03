<template>
  <div class="roles-page page">
    <div class="header">
      <!-- @TODO -->
      <n-input clearable placeholder="Type name to filter" disabled>
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>
    </div>

    <n-grid
      x-gap="20"
      y-gap="20"
      responsive="screen"
      cols="1 s:1 m:2 l:2 xl:2 2xl:2"
    >
      <n-grid-item span="2">
        <roles-table />
      </n-grid-item>

      <n-grid-item span="1">
        <!-- <add-edit-form /> -->
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { NGrid, NIcon, NInput, NGridItem } from "naive-ui";
import { Search as SearchIcon } from "@vicons/carbon";

import RolesTable from "@/components/roles/Table.vue";
</script>
