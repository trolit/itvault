<template>
  <n-data-table
    :data="data"
    :columns="columns"
    :single-line="false"
    :single-column="false"
    :pagination="pagination"
    :loading="isLoading"
    :row-key="(row: IRoleDto) => row.id"
    @update:page="getRoles"
  >
    <template #empty>
      <n-empty description="No roles found." />
    </template>
  </n-data-table>
</template>

<script setup lang="ts">
import {
  NEmpty,
  NButton,
  NDataTable,
  type PaginationProps,
  type DataTableColumns,
} from "naive-ui";
import { ref, reactive, onBeforeMount, type Ref, h } from "vue";

import { useRolesStore } from "@/store/roles";
import type { IRoleDto } from "@shared/types/dtos/IRoleDto";

const rolesStore = useRolesStore();

interface IProps {
  isLoading: boolean;

  data: IRoleDto[];

  total: number;
}

defineProps<IProps>();

const emits = defineEmits(["get-roles"]);

onBeforeMount(async () => {
  getRoles();
});

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  onChange: (page: number) => {
    pagination.page = page;
  },
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

function getRoles() {
  emits("get-roles", {
    page: pagination.page,
    perPage: 10,
  });
}
</script>
