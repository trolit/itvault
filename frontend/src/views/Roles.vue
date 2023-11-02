<template>
  <div class="roles-page page">
    <div class="header">
      <!-- @TODO -->
      <n-input clearable placeholder="Type name filter" disabled>
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>
    </div>

    <n-data-table
      :data="data"
      :columns="columns"
      :single-line="false"
      :single-column="false"
      :pagination="pagination"
      :loading="isLoadingRoles"
      :row-key="(row: IRoleDto) => row.id"
      @update:page="getRoles"
    >
      <template #empty>
        <n-empty description="No roles found." />
      </template>
    </n-data-table>
  </div>
</template>

<script setup lang="ts">
import {
  NIcon,
  NEmpty,
  NInput,
  NButton,
  NDataTable,
  type PaginationProps,
  type DataTableColumns,
} from "naive-ui";
import { Search as SearchIcon } from "@vicons/carbon";
import { ref, reactive, onBeforeMount, type Ref, h } from "vue";

import { useRolesStore } from "@/store/roles";
import { useGeneralStore } from "@/store/general";
import type { IRoleDto } from "@shared/types/dtos/IRoleDto";

const rolesStore = useRolesStore();
const generalStore = useGeneralStore();

const isLoadingRoles = ref(false);
let data: IRoleDto[] = reactive([]);

const defaultPagination = {
  page: 1,
  pageSize: 10,
};

onBeforeMount(async () => {
  await getRoles();
});

const pagination: PaginationProps = reactive({
  ...defaultPagination,
  showSizePicker: true,
  pageSizes: [10, 20, 40],
  onChange: (page: number) => {
    pagination.page = page;

    getRoles();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;

    getRoles();
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
          { default: () => "Edit" }
        ),
      ]);
    },
  },
]);

async function getRoles() {
  isLoadingRoles.value = true;

  try {
    const { result, total } = await rolesStore.getAll({
      page: pagination.page || defaultPagination.page,
      perPage: pagination.pageSize || defaultPagination.pageSize,
    });

    pagination.itemCount = total;

    data = result;
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error(
      "There was an error when trying to load roles."
    );
  } finally {
    isLoadingRoles.value = false;
  }
}
</script>
