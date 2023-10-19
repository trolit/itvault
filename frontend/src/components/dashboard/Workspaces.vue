<template>
  <content-card :icon="WorkspacesIcon" title="Workspaces">
    <template #header-extra>
      <require-permission :permission="Permission.CreateWorkspace">
        <n-button type="info" @click="toggleAddEditWorkspaceDrawer()">
          New workspace
        </n-button>
      </require-permission>
    </template>

    <template #content>
      <!-- @TODO show input only when there are at least 3 pages -->
      <n-input clearable placeholder="Type name or tag to filter">
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>

      <n-data-table
        remote
        single-column
        :max-height="420"
        :data="workspacesStore.items"
        :columns="columns"
        :loading="isLoading"
        :pagination="pagination"
        :row-key="(row: IWorkspaceDto) => row.id"
        @update:page="getWorkspaces"
      >
        <template #empty>
          <n-empty description="No workspaces found." />
        </template>
      </n-data-table>
    </template>
  </content-card>
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
  Workspace as WorkspacesIcon,
} from "@vicons/carbon";
import { useRouter } from "vue-router";
import cloneDeep from "lodash/cloneDeep";
import { h, ref, type Ref, reactive, onBeforeMount } from "vue";
import type { DataTableColumns, PaginationProps } from "naive-ui";

import ContentCard from "./ContentCard.vue";
import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useWorkspacesStore } from "@/store/workspaces";
import { Permission } from "@shared/types/enums/Permission";
import { ROUTE_WORKSPACE_NAME } from "@/assets/constants/routes";
import type { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";
import RequirePermission from "@/components/common/RequirePermission.vue";

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
    width: "30%",
    className: "tags-row",
    render(row) {
      const tags = row.tags.map(tagKey => {
        return h(
          NTag,
          {
            size: "small",
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
    width: 140,
    render(row) {
      return h("div", { class: "actions-wrapper" }, [
        h(
          NButton,
          {
            size: "small",
            onClick: event => {
              event.stopPropagation();

              toggleAddEditWorkspaceDrawer(row);
            },
          },
          { default: () => "Edit" }
        ),
        h(
          NButton,
          {
            size: "small",
            onClick: event => {
              event.stopPropagation();

              workspacesStore.setActiveItem(row);

              router.push({ path: `${ROUTE_WORKSPACE_NAME}/${row.slug}` });
            },
          },
          { default: () => "Open" }
        ),
      ]);
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

// @NOTE consider extracting to helper (?)
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
