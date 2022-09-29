<template>
  <ref-card :icon="WorkspacesIcon" title="Workspaces">
    <template #content>
      <!-- @TODO show input only when there are at least 3 pages -->
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

      <!-- @TODO show pagination if there are at least 2 pages -->
      <n-data-table
        v-model:checked-row-keys="checkedRowKeys"
        :data="data"
        flex-height
        :multiple="false"
        :columns="columns"
        :pagination="pagination"
      >
        <template #empty>
          <n-empty description="No workspaces found." />
        </template>
      </n-data-table>

      <div class="actions">
        <n-button ghost type="success"> New workspace </n-button>

        <router-link to="/">
          <n-button dashed type="info"> Open workspace </n-button>
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
import { ref, type Ref } from "vue";
import type { DataTableColumns, PaginationProps } from "naive-ui";
import type { RowKey } from "naive-ui/es/data-table/src/interface";
import { NDataTable, NButton, NInput, NIcon, NEmpty } from "naive-ui";

import RefCard from "./RefCard.vue";

type RowData = {
  key: number;
  name: string;
  tags: string;
};

const columns: Ref<DataTableColumns<RowData>> = ref<DataTableColumns<RowData>>([
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

const data: Ref<Array<RowData> | undefined> = ref(undefined);

const checkedRowKeys: Ref<Array<RowKey>> = ref([]);

const pagination: PaginationProps = {
  page: 1,
  pageSize: 10,
  size: "small",
};
</script>
