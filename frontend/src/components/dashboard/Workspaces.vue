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
        remote
        flex-height
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

      <div class="actions">
        <require-permission :permission="Permission.CreateWorkspace">
          <n-button ghost type="info"> New workspace </n-button>
        </require-permission>
      </div>
    </template>
  </ref-card>
</template>

<script setup lang="ts">
import {
  Search as SearchIcon,
  DataCenter as WorkspacesIcon,
} from "@vicons/carbon";
import { useRouter } from "vue-router";
import { h, ref, type Ref, reactive, onBeforeMount } from "vue";
import {
  NDataTable,
  NButton,
  NInput,
  NIcon,
  NEmpty,
  NTag,
  useMessage,
} from "naive-ui";
import type { DataTableColumns, PaginationProps } from "naive-ui";

import RefCard from "./RefCard.vue";
import { useWorkspacesStore } from "@/store/workspaces";
import { Permission } from "@shared/types/enums/Permission";
import { ROUTE_WORKSPACE_NAME } from "@/assets/constants/routes";
import type { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";
import RequirePermission from "@/components/common/RequirePermission.vue";
import type { CreateRowProps } from "naive-ui/es/data-table/src/interface";

const router = useRouter();

const isLoading = ref(true);

const defaultPagination = {
  page: 1,
  pageCount: 0,
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
  prefix({ pageSize, itemCount }) {
    return !pageSize || !itemCount
      ? null
      : h(
          NTag,
          {},
          {
            default: () =>
              `Showing ${
                itemCount < pageSize ? itemCount : pageSize
              } out of ${itemCount}`,
          }
        );
  },
});

const workspacesStore = useWorkspacesStore();

const message = useMessage();

onBeforeMount(async () => {
  await getWorkspaces();
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

    pagination.pageCount = Math.ceil(
      total / (pagination.pageSize || defaultPagination.pageSize)
    );
  } catch (error) {
    console.log(error);

    message.error("There was an error when trying to load workspaces.");
  } finally {
    isLoading.value = false;
  }
}
</script>
