<template>
  <n-drawer
    :show="isActive"
    :width="340"
    placement="left"
    to="#sider"
    :show-mask="false"
    :trap-focus="false"
    :block-scroll="false"
    :mask-closable="false"
    @update:show="onShowUpdate"
  >
    <n-drawer-content title="Notes" closable>
      This is notes drawer
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NDrawer, NDrawerContent } from "naive-ui";

import { Drawer } from "@/types/Drawer";
import { useDrawerStore } from "@/store/drawer";

const drawerStore = useDrawerStore();

const isActive = computed((): boolean => {
  return drawerStore.isDrawerActive(Drawer.Notes) || false;
});

const onShowUpdate = () => {
  drawerStore.setActiveDrawer(null);
};
</script>
