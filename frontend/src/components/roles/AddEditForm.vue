<template>
  <loading-section v-if="isLoading" />

  <empty
    v-else-if="!roleTab.permissions.length"
    title="Permissions not found."
  />

  <div class="wrapper" v-else>
    <n-grid
      :cols="4"
      v-for="(permissions, index) in activeTabGroupedPermissions"
      :key="`group-${index}`"
    >
      <n-grid-item class="group" :span="1">
        <span>
          {{ permissions[0].group }}
        </span>
      </n-grid-item>

      <n-grid-item class="permissions" :span="3">
        <n-grid :y-gap="10" :cols="2">
          <n-grid-item
            v-for="(permission, index) in permissions"
            :key="`permission-${index}`"
          >
            <n-checkbox
              size="small"
              :label="permission.name"
              :checked="permission.enabled"
              @update:checked="
                rolesStore.toggleTabPermission(
                  roleTab.role.id,
                  permission.signature
                )
              "
            />
          </n-grid-item>
        </n-grid>
      </n-grid-item>
    </n-grid>

    <n-space justify="space-evenly">
      <n-popconfirm>
        <template #trigger>
          <n-button
            secondary
            type="warning"
            :disabled="isInitialState || isLoading"
          >
            Reset
          </n-button>
        </template>

        Are you sure?
      </n-popconfirm>

      <n-popconfirm>
        <template #trigger>
          <n-button
            secondary
            type="success"
            :loading="isLoading"
            :disabled="isInitialState"
          >
            {{ isActiveTabNewRole ? "Create" : "Update" }}
          </n-button>
        </template>

        Are you sure?
      </n-popconfirm>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {
  NGrid,
  NSpace,
  NButton,
  NCheckbox,
  NGridItem,
  NPopconfirm,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, type PropType } from "vue";

import { useRolesStore } from "@/store/roles";
import type { RoleTab } from "@/types/RoleTab";
import Empty from "@/components/common/Empty.vue";
import { defineComputed } from "@/helpers/defineComputed";
import { usePermissionsStore } from "@/store/permissions";
import LoadingSection from "@/components/common/LoadingSection.vue";

const props = defineProps({
  roleTab: {
    type: Object as PropType<RoleTab>,
    required: true,
  },
});

const rolesStore = useRolesStore();
const permissionsStore = usePermissionsStore();

const { activeTabGroupedPermissions, isActiveTabNewRole } =
  storeToRefs(rolesStore);

const isLoading = ref(false);

onBeforeMount(async () => {
  if (!props.roleTab.permissions.length) {
    getPermissions();
  }
});

const { isInitialState } = defineComputed({
  isInitialState() {
    const tab = rolesStore.activeTab;

    return (
      tab &&
      JSON.stringify(tab.initialPermissions) === JSON.stringify(tab.permissions)
    );
  },
});

async function getPermissions() {
  isLoading.value = true;

  const roleId = props.roleTab.role.id;

  try {
    const data =
      roleId === 0
        ? await permissionsStore.getAll()
        : await rolesStore.getPermissionsById(roleId);

    rolesStore.setTabPermissions(roleId, data);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
