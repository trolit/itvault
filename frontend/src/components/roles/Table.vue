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
    :row-key="(row: IRoleDTO) => row.id"
    @update:page="$event => $emit('get-roles', $event)"
  >
    <template #empty>
      <n-empty description="No roles found." />
    </template>
  </n-data-table>
</template>

<script setup lang="ts">
import {
  NH3,
  NText,
  NEmpty,
  NButton,
  NDataTable,
  type DataTableColumns,
} from "naive-ui";
import { ref, onBeforeMount, type Ref, h } from "vue";

import { useRolesStore } from "@/store/roles";
import type { IRoleDTO } from "@shared/types/DTOs/Role";
import { useDateService } from "@/services/useDateService";

const rolesStore = useRolesStore();
const dateService = useDateService();

interface IProps {
  page: number;

  perPage: number;

  isLoading: boolean;

  data: IRoleDTO[];

  total: number;
}

const props = defineProps<IProps>();

const emits = defineEmits(["get-roles"]);

onBeforeMount(async () => {
  emits("get-roles", props.page);
});

const columns: Ref<DataTableColumns<IRoleDTO>> = ref<
  DataTableColumns<IRoleDTO>
>([
  {
    title: "Name",
    key: "name",
    ellipsis: {
      tooltip: true,
    },
    render: ({ name }) =>
      h(
        NH3,
        {},
        {
          default: () => name,
        }
      ),
  },

  {
    title: "Description",
    key: "description",
    className: "description",
    ellipsis: {
      tooltip: true,
    },
    render: ({ description }) =>
      h(
        NText,
        {
          depth: description ? 1 : 3,
        },
        {
          default: () => description || "No description",
        }
      ),
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

  {
    title: "Updated at",
    key: "updatedAt",
    width: 150,
    ellipsis: {
      tooltip: true,
    },
    render: ({ updatedAt }) =>
      dateService.format(updatedAt, "DD MMM YYYY (HH:mm)"),
  },

  {
    title: "Updated by",
    key: "updatedBy",
    ellipsis: {
      tooltip: true,
    },
    render({ updatedBy }) {
      return updatedBy
        ? h(
            NButton,
            { dashed: true, type: "info" },
            { default: () => updatedBy.fullName }
          )
        : h(NText, { depth: 3 }, { default: () => "SYSTEM" });
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
        // @TODO view users with that role
      ]);
    },
  },
]);
</script>
