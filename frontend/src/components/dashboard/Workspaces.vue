<template>
  <ref-card :icon="WorkspacesIcon" title="Workspaces">
    <template #header-extra>
      <require-permission :permission="Permission.CreateWorkspace">
        <n-button type="info" @click="toggleAddEditWorkspaceDrawer()">
          New workspace
        </n-button>
      </require-permission>
    </template>

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

      <n-data-table
        remote
        :data="workspacesStore.items"
        :columns="columns"
        :loading="isLoading"
        :row-props="rowProps"
        :pagination="pagination"
        :row-key="(row: IWorkspaceDto) => row.id"
        @update:page="getWorkspaces"
      >
        <template #empty>
          <n-empty description="No workspaces found." />
        </template>
      </n-data-table>
    </template>
  </ref-card>
</template>

<script setup lang="ts">
import {
  NTag,
  NIcon,
  NInput,
  NEmpty,
  NButton,
  NDataTable,
  useMessage,
} from "naive-ui";
import {
  Search as SearchIcon,
  DataCenter as WorkspacesIcon,
} from "@vicons/carbon";
import { useRouter } from "vue-router";
import cloneDeep from "lodash/cloneDeep";
import { h, ref, type Ref, reactive, onBeforeMount } from "vue";
import type { DataTableColumns, PaginationProps } from "naive-ui";

import RefCard from "./RefCard.vue";
import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useWorkspacesStore } from "@/store/workspaces";
import { Permission } from "@shared/types/enums/Permission";
import { ROUTE_WORKSPACE_NAME } from "@/assets/constants/routes";
import type { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";
import RequirePermission from "@/components/common/RequirePermission.vue";
import type { CreateRowProps } from "naive-ui/es/data-table/src/interface";

const router = useRouter();
const message = useMessage();
const drawerStore = useDrawerStore();
const workspacesStore = useWorkspacesStore();

const isLoading = ref(true);

const defaultPagination = {
  page: 1,
  pageSize: 10,
};

const pagination: PaginationProps = reactive({
  ...defaultPagination,
  showSizePicker: true,
  pageSizes: [10, 20, 40],
  onChange: (page: number) => {
    pagination.page = page;

    getWorkspaces();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;

    getWorkspaces();
  },
});

onBeforeMount(async () => {
  getWorkspaces();
});

const rowProps: CreateRowProps<IWorkspaceDto> = (row: IWorkspaceDto) => {
  return {
    style: "{cursor: 'pointer'}",
    onclick: () => {
      workspacesStore.setActiveItem(row);

      router.push({ path: `${ROUTE_WORKSPACE_NAME}/${row.slug}` });
    },
  };
};

const columns: Ref<DataTableColumns<IWorkspaceDto>> = ref<
  DataTableColumns<IWorkspaceDto>
>([
  {
    title: "Name",
    key: "name",
  },

  {
    title: "Tags",
    key: "tags",
    className: "tags-row",
    render(row) {
      const tags = row.tags.map(tagKey => {
        return h(
          NTag,
          {
            type: "info",
          },
          {
            default: () => tagKey,
          }
        );
      });

      return tags;
    },
  },

  {
    title: "Actions",
    key: "actions",
    render(row) {
      return h(
        NButton,
        {
          size: "small",
          onClick: event => {
            event.stopPropagation();

            toggleAddEditWorkspaceDrawer(row);
          },
        },
        { default: () => "Edit" }
      );
    },
  },
]);

async function getWorkspaces() {
  isLoading.value = true;

  const { total } = workspacesStore;

  try {
    await workspacesStore.getAll({
      page: pagination.page || defaultPagination.page,
      perPage: pagination.pageSize || defaultPagination.pageSize,
    });

    pagination.itemCount = total;
  } catch (error) {
    console.log(error);

    message.error("There was an error when trying to load workspaces.");
  } finally {
    isLoading.value = false;
  }
}

function toggleAddEditWorkspaceDrawer(newItemToEdit?: IWorkspaceDto) {
  const isSameItemToEdit = !!(
    workspacesStore.itemToEdit?.id === newItemToEdit?.id
  );

  workspacesStore.itemToEdit = newItemToEdit ? cloneDeep(newItemToEdit) : null;

  if (
    !isSameItemToEdit &&
    drawerStore.isDrawerActive(Drawer.AddEditWorkspace)
  ) {
    return;
  }

  drawerStore.setActiveDrawer(Drawer.AddEditWorkspace);
}
</script>
