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
import { ref, onBeforeMount, type Ref, h } from "vue";
import { NEmpty, NButton, NDataTable, type DataTableColumns } from "naive-ui";

import { useRolesStore } from "@/store/roles";
import type { IRoleDto } from "@shared/types/dtos/IRoleDto";

const rolesStore = useRolesStore();

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
