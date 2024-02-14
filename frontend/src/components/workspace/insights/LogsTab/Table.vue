<template>
  <n-data-table
    remote
    flex-height
    :data="logsTabData.items"
    :columns="columns"
    :single-line="false"
    :single-column="false"
    :pagination="{
      page: logsTabData.pagination.page,
      pageSize: logsTabData.pagination.perPage,
      itemCount: logsTabData.total,
    }"
    :loading="isLoading"
    :row-key="(row: IWorkspaceTraceDTO) => row.id"
    @update:page="$event => $emit('get-roles', $event)"
  >
    <template #empty>
      <n-empty description="No roles found." />
    </template>
  </n-data-table>
</template>

<script setup lang="ts">
import {
  NText,
  NEmpty,
  NButton,
  NDataTable,
  type DataTableColumns,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { h, ref, type Ref } from "vue";

import { useInsightsStore } from "@/store/insights";
import { useDateService } from "@/services/useDateService";
import type { IWorkspaceTraceDTO } from "@shared/types/DTOs/Workspace";

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

const dateService = useDateService();
const insightsStore = useInsightsStore();

const { logsTabData } = storeToRefs(insightsStore);

const columns: Ref<DataTableColumns<IWorkspaceTraceDTO>> = ref<
  DataTableColumns<IWorkspaceTraceDTO>
>([
  {
    title: "Name",
    key: "entity",
    ellipsis: {
      tooltip: true,
    },
  },

  {
    title: "Action",
    key: "action",
    ellipsis: {
      tooltip: true,
    },
  },

  {
    title: "Created at",
    key: "createdAt",
    width: 150,
    ellipsis: {
      tooltip: true,
    },
    render: ({ createdAt }) =>
      dateService.format(createdAt, "DD MMM YYYY (HH:mm)"),
  },

  {
    title: "Created by",
    key: "createdBy",
    ellipsis: {
      tooltip: true,
    },
    render({ createdBy }) {
      return createdBy
        ? h(
            NButton,
            { dashed: true, type: "info" },
            { default: () => createdBy.fullName }
          )
        : h(NText, { depth: 3 }, { default: () => "SYSTEM" });
    },
  },
]);
</script>
