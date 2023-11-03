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
        <n-button size="small">
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
      <n-grid-item v-if="hasAnyTab" span="1">
        <n-card>
          <n-tabs
            key="oasis"
            type="line"
            justify-content="space-evenly"
            animated
          >
            <n-tab-pane name="oasis" tab="Oasis"> Wonderwall </n-tab-pane>
          </n-tabs>

          <add-edit-form />
        </n-card>
      </n-grid-item>

      <n-grid-item :span="hasAnyTab ? 2 : 3">
        <roles-table />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import {
  NCard,
  NGrid,
  NTabs,
  NIcon,
  NInput,
  NButton,
  NTabPane,
  NGridItem,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { Add as AddIcon, Search as SearchIcon } from "@vicons/carbon";

import { useRolesStore } from "@/store/roles";
import RolesTable from "@/components/roles/Table.vue";
import { Permission } from "@shared/types/enums/Permission";
import AddEditForm from "@/components/roles/AddEditForm.vue";
import RequirePermission from "@/components/common/RequirePermission.vue";

const rolesStore = useRolesStore();

const { hasAnyTab } = storeToRefs(rolesStore);
</script>
