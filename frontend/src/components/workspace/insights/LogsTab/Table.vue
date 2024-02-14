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
    @update:page="$event => $emit('get-logs', $event)"
  >
    <template #empty>
      <n-empty description="No logs found." />
    </template>
  </n-data-table>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { h, ref, type Ref } from "vue";
import { NEmpty, NButton, NDataTable, type DataTableColumns } from "naive-ui";

import { useInsightsStore } from "@/store/insights";
import { useDateService } from "@/services/useDateService";
import type { IWorkspaceTraceDTO } from "@shared/types/DTOs/Workspace";

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

defineEmits<{
  (event: "get-logs", page: number): void;
}>();

const dateService = useDateService();
const insightsStore = useInsightsStore();

const { logsTabData } = storeToRefs(insightsStore);

const columns: Ref<DataTableColumns<IWorkspaceTraceDTO>> = ref<
  DataTableColumns<IWorkspaceTraceDTO>
>([
  {
    title: "Entity",
    key: "entity",
    ellipsis: {
      tooltip: true,
    },
  },

  {
    title: "Operation",
    key: "action",
    ellipsis: {
      tooltip: true,
    },
  },

  {
    title: "Created at",
    key: "createdAt",
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
    render: ({ createdBy }) =>
      h(
        NButton,
        { size: "small", secondary: true },
        { default: () => createdBy.fullName }
      ),
  },

  {
    title: "Actions",
    key: "actions",
    ellipsis: {
      tooltip: true,
    },
    render() {
      return h("div", { class: "actions-wrapper" }, [
        h(
          NButton,
          {
            size: "small",
            onClick: event => {
              event.stopPropagation();
            },
          },
          { default: () => "Open" }
        ),
      ]);
    },
  },
]);
</script>
