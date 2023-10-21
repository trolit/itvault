<template>
  <div class="users-page page">
    <div class="header">
      <!-- @TODO -->
      <n-input clearable placeholder="Type email or full name to filter">
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>

      <div class="wrapper" v-if="usersStore.itemsToUpdate.length">
        <small>New changes detected!</small>

        <n-popconfirm @positive-click="usersStore.itemsToUpdate = []">
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
    </div>

    <n-data-table
      remote
      flex-height
      single-column
      :data="usersStore.items"
      :columns="columns"
      :loading="isLoadingUsers"
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
  NIcon,
  NEmpty,
  NInput,
  NButton,
  NSwitch,
  NDataTable,
  useMessage,
  NPopconfirm,
  type PaginationProps,
  type DataTableColumns,
} from "naive-ui";
import { Search as SearchIcon } from "@vicons/carbon";
import { h, onBeforeMount, reactive, ref, type Ref } from "vue";

import { useRolesStore } from "@/store/roles";
import { useUsersStore } from "@/store/users";
import type { IUserDto } from "@shared/types/dtos/IUserDto";
import ScrollSelect from "@/components/common/ScrollSelect.vue";

const message = useMessage();
const rolesStore = useRolesStore();
const usersStore = useUsersStore();

const rolesPage = ref(1);
const isLoadingUsers = ref(true);
const isLoadingRoles = ref(false);

const rolesPerPage = 5;
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
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },

  {
    title: "Email",
    key: "email",
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },

  {
    title: "Role",
    key: "roleName",
    ellipsis: true,
    cellProps: rowData => {
      const { id } = rowData;

      const roleIdToUpdate = usersStore.findItemToUpdateRoleId(id);

      return roleIdToUpdate
        ? { style: { outline: "2px dashed #FF0000", outlineOffset: "-10px" } }
        : {};
    },
    render: rowData => {
      const { id, roleId } = rowData;

      // @NOTE maybe extract HEAD_ADMIN_ID to shared module or do not return head admin at all (?)
      if (roleId === 1) {
        return `⭐ ${rowData.roleName}`;
      }

      const roleIdToUpdate = usersStore.findItemToUpdateRoleId(id);

      return h(ScrollSelect, {
        value: roleIdToUpdate || roleId,
        options: rolesStore.options,
        disabled: isLoadingRoles.value,
        consistentMenuWidth: false,

        onScroll: getRoles,
        onSelect: newRoleId => usersStore.setRole(id, newRoleId),
      });
    },
  },

  {
    title: "Invited by",
    key: "invitedBy",
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
    width: 100,
    render: row => row.invitedBy || "-",
  },

  {
    title: "Signed up?",
    key: "isSignedUp",
    width: 100,
    render: rowData => {
      const isSignedUp = !!rowData.isSignedUp;

      if (rowData.roleId === 1) {
        return "-";
      }

      return h(
        NTag,
        { type: isSignedUp ? "default" : "error" },
        { default: () => (isSignedUp ? "Yes" : "No") }
      );
    },
  },

  {
    title: "Active?",
    key: "isActive",
    width: 80,
    cellProps: rowData => {
      const { id } = rowData;

      const isActiveToUpdate = usersStore.findItemToUpdateIsActive(id);

      return isActiveToUpdate !== null
        ? { style: { outline: "2px dashed #FF0000", outlineOffset: "-10px" } }
        : {};
    },
    render: rowData => {
      const { id, roleId, isActive } = rowData;

      if (roleId === 1) {
        return "-";
      }

      const isActiveToUpdate = usersStore.findItemToUpdateIsActive(id);

      return h(
        NSwitch,
        {
          round: false,
          value: isActiveToUpdate === null ? isActive : isActiveToUpdate,

          "on-update:value": (value: boolean) =>
            usersStore.setIsActive(id, value),
        },
        { checked: () => "Yes", unchecked: () => "No" }
      );
    },
  },
]);

async function getUsers() {
  isLoadingUsers.value = true;

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
    isLoadingUsers.value = false;
  }
}

async function getRoles() {
  isLoadingRoles.value = true;

  try {
    await rolesStore.getAll({
      page: rolesPage.value,
      perPage: rolesPerPage,
    });

    rolesPage.value += 1;
  } catch (error) {
    console.log(error);

    message.error("There was an error when trying to load roles!");
  } finally {
    isLoadingRoles.value = false;
  }
}
</script>
