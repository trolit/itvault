<template>
  <ref-card :icon="WorkspacesIcon" title="Workspaces">
    <template #content>
      <n-input
        clearable
        show-count
        maxlength="30"
        placeholder="Type name or tag to filter"
      >
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>

      <n-data-table
        v-model:checked-row-keys="checkedRowKeys"
        :data="data"
        flex-height
        :multiple="false"
        :columns="columns"
        :pagination="pagination"
      >
        <template #empty>
          <n-empty description="No workspaces defined">
            <template #extra>
              <n-button type="warning" ghost> Create first workspace </n-button>
            </template>
          </n-empty>
        </template>
      </n-data-table>

      <div class="actions">
        <router-link to="welcome">
          <n-button type="info" dashed> Open workspace </n-button>
        </router-link>
      </div>
    </template>
  </ref-card>
</template>

<script setup lang="ts">
import {
  Search as SearchIcon,
  DataCenter as WorkspacesIcon,
} from "@vicons/carbon";
import { ref } from "vue";
import type { DataTableColumns } from "naive-ui";
import { NDataTable, NButton, NInput, NIcon, NEmpty } from "naive-ui";
import type { RowKey } from "naive-ui/es/data-table/src/interface";

import RefCard from "./RefCard.vue";

type RowData = {
  key: number;
  name: string;
  age: number;
  address: string;
};

const columns = ref<DataTableColumns<RowData>>([
  {
    type: "selection",
    multiple: false,
  },
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Tags",
    key: "tags",
  },
]);

const pagination = {
  page: 1,
  pageSize: 10,
};

const data = ref(undefined);

const checkedRowKeys = ref<Array<RowKey>>([]);
</script>
