<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      :show-trigger="!isNotesDrawerActive && !isBundleDrawerActive"
      :width="workspacesStore.GENERAL_SIDER_WIDTH"
      :collapsed-width="0"
      collapse-mode="transform"
      :native-scrollbar="false"
      :inverted="inverted"
      :collapsed="workspacesStore.isGeneralSiderCollapsed"
      :style="{ zIndex: 1000 }"
      :trigger-style="{
        borderRadius: 0,
        top: workspacesStore.TRIGGER_STYLE_TOP,
        height: workspacesStore.TRIGGER_STYLE_HEIGHT,
        transform: 'translateX(0%) translateY(0%)',
      }"
      :collapsed-trigger-style="{
        borderRadius: 0,
        top: workspacesStore.TRIGGER_STYLE_TOP,
        height: workspacesStore.TRIGGER_STYLE_HEIGHT,
        transform: 'translateX(100%) translateY(0%)',
      }"
      @expand="workspacesStore.toggleGeneralSider"
      @collapse="workspacesStore.toggleGeneralSider"
    >
      <div class="sider">
        <slot name="sider"></slot>
      </div>
    </n-layout-sider>

    <div class="main-content-wrapper">
      <slot name="main-content"></slot>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { NLayout, NLayoutSider } from "naive-ui";

import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useWorkspacesStore } from "@/store/workspaces";

const inverted = ref(false);

const drawerStore = useDrawerStore();
const workspacesStore = useWorkspacesStore();

const isNotesDrawerActive = computed(() => {
  return drawerStore.isDrawerActive(Drawer.Notes) || false;
});

const isBundleDrawerActive = computed(() => {
  return drawerStore.isDrawerActive(Drawer.Bundle) || false;
});
</script>
