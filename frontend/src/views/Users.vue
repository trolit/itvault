<template>
  <div class="users-page page">
    <div class="header">
      <require-permission :permission="Permission.CreateUser">
        <n-button
          secondary
          size="small"
          type="success"
          @click="isCreateAccountModalVisible = true"
        >
          <n-icon :component="AddIcon" :size="25" />
        </n-button>
      </require-permission>

      <!-- @TODO -->
      <n-input
        clearable
        placeholder="Type email or full name to filter"
        disabled
      >
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

        <n-popconfirm @positive-click="updateUsers">
          <template #trigger>
            <n-button
              ghost
              size="small"
              type="success"
              :loading="isLoadingUsers"
            >
              Save
            </n-button>
          </template>

          Are you sure?
        </n-popconfirm>
      </div>
    </div>

    <n-data-table
      flex-height
      single-column
      :data="usersStore.items"
      :columns="columns"
      :loading="isLoadingUsers"
      :pagination="pagination"
      :row-key="(row: IUserDTO) => row.id"
      @update:page="getUsers"
    >
      <template #empty>
        <n-empty description="No users found." />
      </template>
    </n-data-table>

    <create-account-modal
      :is-visible="isCreateAccountModalVisible"
      :roles="options"
      :is-loading-roles="isLoadingRoles"
      @select-blur="onAsynchronousSelectBlur"
      @select-filter="onAsynchronousSelectFilter"
      @update:is-visible="isCreateAccountModalVisible = false"
    />

    <manage-workspaces-drawer
      :user="userWorkspacesToEdit"
      :is-visible="isManageWorkspacesDrawerVisible"
      @close="isManageWorkspacesDrawerVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import {
  NTag,
  NText,
  NIcon,
  NEmpty,
  NInput,
  NButton,
  NSwitch,
  NTooltip,
  NDataTable,
  NPopconfirm,
  type PaginationProps,
  type DataTableColumns,
} from "naive-ui";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Workspace as WorkspacesIcon,
} from "@vicons/carbon";
import uniqBy from "lodash/uniqBy";
import cloneDeep from "lodash/cloneDeep";
import { h, onBeforeMount, reactive, ref, type Ref } from "vue";

import { useAuthStore } from "@/store/auth";
import { useRolesStore } from "@/store/roles";
import { useUsersStore } from "@/store/users";
import { useGeneralStore } from "@/store/general";
import type { IRoleDTO } from "@shared/types/DTOs/Role";
import type { IUserDTO } from "@shared/types/DTOs/User";
import { defineComputed } from "@/helpers/defineComputed";
import { Permission } from "@shared/types/enums/Permission";
import RequirePermission from "@/components/common/RequirePermission.vue";
import CreateAccountModal from "@/components/users/CreateAccountModal.vue";
import AsynchronousSelect from "@/components/common/AsynchronousSelect.vue";
import ManageWorkspacesDrawer from "@/components/users/ManageWorkspacesDrawer.vue";

const authStore = useAuthStore();
const rolesStore = useRolesStore();
const usersStore = useUsersStore();
const generalStore = useGeneralStore();

const isLoadingUsers = ref(true);
const isLoadingRoles = ref(false);
const rolessSearchTimeoutId = ref(0);
const isCreateAccountModalVisible = ref(false);
const isManageWorkspacesDrawerVisible = ref(false);
const userWorkspacesToEdit: Ref<IUserDTO | null> = ref(null);
let filteredRoles: { value: IRoleDTO[] } = reactive({ value: [] });
let allFetchedRoles: { value: IRoleDTO[] } = reactive({ value: [] });

const defaultPagination = {
  page: 1,
  pageSize: 10,
};

onBeforeMount(async () => {
  getRoles();
});

const { options } = defineComputed({
  options() {
    const value = filteredRoles.value.map(({ id, name }) => ({
      label: name,
      value: id,
    }));

    value.sort((a, b) => a.label.localeCompare(b.label));

    return value;
  },
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

const columns: Ref<DataTableColumns<IUserDTO>> = ref<
  DataTableColumns<IUserDTO>
>([
  {
    title: "Full name",
    key: "fullName",
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
    width: "20%",
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
      const { id, roleId, roleName } = rowData;

      const roleIdToUpdate = usersStore.findItemToUpdateRoleId(id);

      const idToFind = roleIdToUpdate || roleId;

      const matchingRole = allFetchedRoles.value.find(
        role => role.id === idToFind
      );

      return h(AsynchronousSelect, {
        value: matchingRole ? matchingRole.name : roleName,
        options: options.value,
        loading: isLoadingRoles.value,
        consistentMenuWidth: false,

        onBlur: onAsynchronousSelectBlur,
        onFilter: onAsynchronousSelectFilter,
        onSelect: (selectedRoleId: number) => {
          usersStore.setRole(id, selectedRoleId);

          setTimeout(
            () => (filteredRoles.value = cloneDeep(allFetchedRoles.value)),
            200
          );
        },
      });
    },
  },

  {
    title: "Invited by",
    key: "invitedBy",
    ellipsis: {
      tooltip: true,
    },
    width: "10%",
    render: row => row.invitedBy || "-",
  },

  {
    title: "Signed up?",
    key: "isSignedUp",
    width: "10%",
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
    width: "10%",
    cellProps: rowData => {
      const { id } = rowData;

      const isActiveToUpdate = usersStore.findItemToUpdateIsActive(id);

      return isActiveToUpdate !== null
        ? { style: { outline: "2px dashed #FF0000", outlineOffset: "-10px" } }
        : {};
    },
    render: rowData => {
      const { id, isActive } = rowData;

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

  {
    title: "Action(s)",
    key: "actions",
    width: 140,
    render(user) {
      if (
        !authStore.hasPermission(Permission.ManageUserWorkspaces) ||
        !user.isActive
      ) {
        return h(
          "div",
          {
            class: "text-center",
            style: { fontSize: "13px" },
          },
          h(
            NText,
            {
              depth: 3,
            },
            { default: () => "(Not available)" }
          )
        );
      }

      return h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        },
        [
          h(
            NButton,
            {
              text: true,
              onClick: event => {
                event.stopPropagation();

                userWorkspacesToEdit.value = user;

                isManageWorkspacesDrawerVisible.value = true;
              },
            },
            {
              default: () =>
                h(
                  NTooltip,
                  {},
                  {
                    default: () => "Manage workspaces",
                    trigger: () =>
                      h(NIcon, { component: WorkspacesIcon, size: 20 }),
                  }
                ),
            }
          ),
        ]
      );
    },
  },
]);

function onAsynchronousSelectBlur() {
  setTimeout(
    () => (filteredRoles.value = cloneDeep(allFetchedRoles.value)),
    200
  );
}

function onAsynchronousSelectFilter(value: string) {
  if (!value) {
    filteredRoles.value = cloneDeep(allFetchedRoles.value);

    return;
  }

  getRoles(value);
}

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

    generalStore.messageProvider.error(
      "There was an error when trying to load users."
    );
  } finally {
    isLoadingUsers.value = false;
  }
}

function getRoles(name?: string) {
  if (isLoadingRoles.value) {
    return;
  }

  if (rolessSearchTimeoutId.value) {
    clearTimeout(rolessSearchTimeoutId.value);
  }

  rolessSearchTimeoutId.value = setTimeout(async () => {
    isLoadingRoles.value = true;

    try {
      const nameQuery = name ? { name } : {};

      const { result } = await rolesStore.getAll({
        page: 1,
        perPage: 6,
        ...nameQuery,
      });

      filteredRoles.value = result;

      allFetchedRoles.value = uniqBy(
        Array.prototype.concat(cloneDeep(result), allFetchedRoles.value),
        value => value.id
      );
    } catch (error) {
      console.log(error);

      generalStore.messageProvider.error(
        "There was an error when trying to load roles!"
      );
    } finally {
      isLoadingRoles.value = false;
    }
  }, 200);
}

async function updateUsers() {
  if (isLoadingUsers.value) {
    return;
  }

  isLoadingUsers.value = true;

  try {
    await usersStore.updateMany();

    generalStore.messageProvider.success("Changes saved!");
  } catch (error) {
    console.log(error);

    // @TODO handle yup response

    generalStore.messageProvider.error(
      "There was an error when committing changes!"
    );
  } finally {
    isLoadingUsers.value = false;
  }
}
</script>
