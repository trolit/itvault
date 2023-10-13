<template>
  <div class="users-page page">
    <div class="header" align="center">
      <small>New changes!</small>

      <n-popconfirm>
        <template #trigger>
          <n-button type="warning" ghost size="small"> Discard </n-button>
        </template>

        Are you sure?
      </n-popconfirm>

      <n-popconfirm>
        <template #trigger>
          <n-button ghost size="small" type="success"> Save </n-button>
        </template>

        Are you sure?
      </n-popconfirm>
    </div>

    <n-data-table
      remote
      striped
      flex-height
      single-column
      :data="usersStore.items"
      :columns="columns"
      :loading="isLoading"
      :pagination="pagination"
      :row-key="(row: IUserDto) => row.id"
      @update:page="getUsers"
    >
      <template #empty>
        <n-empty description="No workspaces found." />
      </template>
    </n-data-table>
  </div>
</template>

<script setup lang="ts">
import {
  NTag,
  NEmpty,
  NButton,
  NDataTable,
  useMessage,
  NPopconfirm,
  type PaginationProps,
  type DataTableColumns,
} from "naive-ui";
import { h, onBeforeMount, reactive, ref, type Ref } from "vue";

import { useUsersStore } from "@/store/users";
import type { IUserDto } from "@shared/types/dtos/IUserDto";

const message = useMessage();
const usersStore = useUsersStore();

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

    getUsers();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;

    getUsers();
  },
});

onBeforeMount(async () => {
  getUsers();
});

const columns: Ref<DataTableColumns<IUserDto>> = ref<
  DataTableColumns<IUserDto>
>([
  {
    title: "Full name",
    key: "fullName",
    ellipsis: true,
    resizable: true,
  },

  {
    title: "Email",
    key: "email",
    ellipsis: true,
    resizable: true,
  },

  {
    title: "Role",
    key: "roleName",
    ellipsis: true,
  },

  {
    title: "Invited by",
    key: "invitedBy",
    ellipsis: true,
    render: row => row.invitedBy || "-",
  },

  {
    title: "Signed up?",
    key: "isSignedUp",
    width: 80,
    render: row => {
      const isSignedUp = !!row.isSignedUp;

      return h(
        NTag,
        { type: isSignedUp ? "default" : "error" },
        isSignedUp ? "Yes" : "No"
      );
    },
  },

  {
    title: "Active?",
    key: "isActive",
    width: 80,
    render: row => {
      const isActive = !!row.isActive;

      return h(
        NTag,
        { type: isActive ? "default" : "error" },
        isActive ? "Yes" : "No"
      );
    },
  },
]);

async function getUsers() {
  isLoading.value = true;

  const { total } = usersStore;

  try {
    await usersStore.getAll({
      page: pagination.page || defaultPagination.page,
      perPage: pagination.pageSize || defaultPagination.pageSize,
    });

    pagination.itemCount = total;
  } catch (error) {
    console.log(error);

    message.error("There was an error when trying to load users.");
  } finally {
    isLoading.value = false;
  }
}
</script>
