<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      :show-trigger="!isNotesDrawerActive && !isBundleDrawerActive"
      :width="340"
      :collapsed-width="8"
      collapse-mode="transform"
      :native-scrollbar="false"
      :inverted="inverted"
      :collapsed="generalStore.isSiderCollapsed"
      @expand="generalStore.toggleSider"
      @collapse="generalStore.toggleSider"
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
import { useGeneralStore } from "@/store/general";

const inverted = ref(false);
const drawerStore = useDrawerStore();
const generalStore = useGeneralStore();

const isNotesDrawerActive = computed(() => {
  return drawerStore.isDrawerActive(Drawer.Notes) || false;
});

const isBundleDrawerActive = computed(() => {
  return drawerStore.isDrawerActive(Drawer.Bundle) || false;
});
</script>
