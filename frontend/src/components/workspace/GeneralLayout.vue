<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      :show-trigger="!isNotesDrawerActive"
      :width="340"
      :collapsed-width="8"
      collapse-mode="transform"
      :native-scrollbar="false"
      :inverted="inverted"
      :collapsed="preferencesStore.isSiderCollapsed"
      @expand="preferencesStore.toggleSider"
      @collapse="preferencesStore.toggleSider"
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

import { Drawer } from "@/types/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { usePreferencesStore } from "@/store/preferences";

const inverted = ref(false);
const drawerStore = useDrawerStore();
const preferencesStore = usePreferencesStore();

const isNotesDrawerActive = computed((): boolean => {
  return drawerStore.isDrawerActive(Drawer.Notes) || false;
});
</script>
