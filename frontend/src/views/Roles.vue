<template>
  <div class="roles-page page">
    <div class="header">
      <!-- @TODO -->
      <n-input clearable placeholder="Type name to filter" disabled>
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>

      <require-permission :permission="Permission.CreateBlueprint">
        <n-button
          size="small"
          :disabled="includesEmptyTab"
          @click="rolesStore.addEmptyTab"
        >
          <n-icon :component="AddIcon" :size="25" />
        </n-button>
      </require-permission>
    </div>

    <n-grid
      x-gap="10"
      y-gap="10"
      responsive="screen"
      cols="1 s:1 m:3 l:3 xl:3 2xl:3"
    >
      <n-grid-item v-if="includesAnyTab" span="1">
        <n-card :bordered="false">
          <roles-tabs />
        </n-card>
      </n-grid-item>

      <n-grid-item :span="includesAnyTab ? 2 : 3">
        <roles-table />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Add as AddIcon, Search as SearchIcon } from "@vicons/carbon";
import { NCard, NGrid, NIcon, NInput, NButton, NGridItem } from "naive-ui";

import { useRolesStore } from "@/store/roles";
import RolesTabs from "@/components/roles/Tabs.vue";
import RolesTable from "@/components/roles/Table.vue";
import { Permission } from "@shared/types/enums/Permission";
import RequirePermission from "@/components/common/RequirePermission.vue";

const rolesStore = useRolesStore();

const { includesAnyTab, includesEmptyTab } = storeToRefs(rolesStore);
</script>
