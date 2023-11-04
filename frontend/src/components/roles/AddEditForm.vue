<template>
  <div>{{ roleTab.permissions }}</div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, type PropType } from "vue";

import { useRolesStore } from "@/store/roles";
import type { RoleTab } from "@/types/RoleTab";
import { usePermissionsStore } from "@/store/permissions";

const props = defineProps({
  roleTab: {
    type: Object as PropType<RoleTab>,
    required: true,
  },
});

const rolesStore = useRolesStore();
const permissionsStore = usePermissionsStore();

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
