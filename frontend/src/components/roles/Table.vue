<template>
  <n-data-table
    remote
    flex-height
    :data="data"
    :columns="columns"
    :single-line="false"
    :single-column="false"
    :pagination="{ page, pageSize: perPage, itemCount: total }"
    :loading="isLoading"
    :row-key="(row: IRoleDto) => row.id"
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
import { ref, onBeforeMount, type Ref, h } from "vue";

import { useRolesStore } from "@/store/roles";
import { useDateService } from "@/services/useDateService";
import type { IRoleDto } from "@shared/types/dtos/IRoleDto";

const rolesStore = useRolesStore();
const dateService = useDateService();

interface IProps {
  page: number;

  perPage: number;

  isLoading: boolean;

  data: IRoleDto[];

  total: number;
}

const props = defineProps<IProps>();

const emits = defineEmits(["get-roles"]);

onBeforeMount(async () => {
  emits("get-roles", props.page);
});

const columns: Ref<DataTableColumns<IRoleDto>> = ref<
  DataTableColumns<IRoleDto>
>([
  {
    title: "Name",
    key: "name",
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
    render({ createdBy }) {
      return createdBy ? createdBy.fullName : h(NText, { depth: 3 }, "SYSTEM");
    },
  },

  {
    title: "Updated at",
    key: "updatedAt",
    ellipsis: {
      tooltip: true,
    },
    render: ({ createdAt }) =>
      dateService.format(createdAt, "DD MMM YYYY (HH:mm)"),
  },

  {
    title: "Updated by",
    key: "updatedBy",
    ellipsis: {
      tooltip: true,
    },
    render({ updatedBy }) {
      return updatedBy ? updatedBy.fullName : h(NText, { depth: 3 }, "SYSTEM");
    },
  },

  {
    title: "Action(s)",
    key: "actions",
    width: 140,
    render(role) {
      return h("div", { class: "actions-wrapper" }, [
        h(
          NButton,
          {
            size: "small",
            onClick: event => {
              event.stopPropagation();

              rolesStore.setActiveTab(role);
            },
          },
          { default: () => "Edit" }
        ),
      ]);
    },
  },
]);
</script>
