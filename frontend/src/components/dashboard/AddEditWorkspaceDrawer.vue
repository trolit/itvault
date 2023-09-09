<template>
  <n-drawer
    :show="isActive"
    :width="502"
    placement="right"
    to="#main-content"
    :show-mask="false"
    :trap-focus="false"
    :block-scroll="false"
    :mask-closable="false"
    @update:show="dismissDrawer"
  >
    <n-drawer-content :title="title" closable>
      Init

      <template #footer>
        <n-space justify="space-between" class="w-100" align="center">
          <require-permission
            :permission="
              isEditMode
                ? Permission.UpdateWorkspace
                : Permission.CreateWorkspace
            "
          >
            <n-button secondary type="success" :loading="isLoading">
              {{ isEditMode ? "Update" : "Create" }}
            </n-button>
          </require-permission>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { NSpace, NButton, NDrawer, NDrawerContent } from "naive-ui";

import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";
import { Permission } from "@shared/types/enums/Permission";
import RequirePermission from "@/components/common/RequirePermission.vue";

const drawerStore = useDrawerStore();
const workspacesStore = useWorkspacesStore();

const isLoading = ref(false);
const { itemToEdit } = storeToRefs(workspacesStore);

const { isActive, title, isEditMode } = defineComputed({
  isActive() {
    return drawerStore.isDrawerActive(Drawer.AddEditWorkspace) || false;
  },

  isEditMode() {
    return !!workspacesStore.itemToEdit;
  },

  title(): string {
    return `${isEditMode.value ? "Edit" : "Add"} workspace`;
  },
});

defineWatchers({
  isActive: {
    source: isActive,
    handler(value: boolean) {
      if (!value) {
        return;
      }
    },
  },

  itemToEdit: {
    source: itemToEdit,
    handler() {},
  },
});

const dismissDrawer = () => {
  drawerStore.setActiveDrawer(null);
};
</script>
