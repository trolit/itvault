<template>
  <loading-section v-if="isLoading" />

  <empty
    v-else-if="!roleTab.permissions.length"
    title="Permissions not found."
  />

  <div v-else>
    <n-checkbox-group
      v-for="(permissions, index) in activeTabGroupedPermissions"
      :key="`group-${index}`"
    >
      <n-grid :cols="3">
        <n-grid-item :span="1">
          {{ permissions[0].group }}
        </n-grid-item>

        <n-grid-item :span="2">
          <n-grid :y-gap="10" :cols="2">
            <n-grid-item
              v-for="(permission, index) in permissions"
              :key="`permission-${index}`"
            >
              <n-checkbox
                size="small"
                :label="permission.name"
                :checked="permission.enabled"
              />
            </n-grid-item>
          </n-grid>
        </n-grid-item>
      </n-grid>
    </n-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, type PropType } from "vue";
import { NCheckbox, NCheckboxGroup, NGrid, NGridItem } from "naive-ui";

import { useRolesStore } from "@/store/roles";
import type { RoleTab } from "@/types/RoleTab";
import Empty from "@/components/common/Empty.vue";
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

const { activeTabGroupedPermissions } = storeToRefs(rolesStore);

const isLoading = ref(false);

onBeforeMount(async () => {
  if (!props.roleTab.permissions.length) {
    getPermissions();
  }
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
