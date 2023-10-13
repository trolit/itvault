<template>
  <div class="users-page page">
    <n-data-table
      remote
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
  NDataTable,
  useMessage,
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
  },

  {
    title: "Email",
    key: "email",
  },

  {
    title: "Role",
    key: "roleName",
  },

  {
    title: "Invited by",
    key: "invitedBy",
    render: row => row.invitedBy || "-",
  },

  {
    title: "Signed up?",
    key: "isSignedUp",
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
