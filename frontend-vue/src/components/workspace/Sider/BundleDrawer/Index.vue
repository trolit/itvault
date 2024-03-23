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
    class="bundle-drawer"
    @update:show="onShowUpdate"
  >
    <n-drawer-content :title="`Bundle #${bundlesStore.activeItemId}`" closable>
      <div v-if="bundle">
        <owner :bundle="bundle" />

        <n-divider />

        <size :bundle="bundle" />

        <n-divider />

        <status :bundle="bundle" />

        <n-divider />

        <note :bundle="bundle" />

        <n-divider />

        <blueprints :blueprints="bundle.blueprints" />
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { NDrawer, NDivider, NDrawerContent } from "naive-ui";

import Note from "./Note.vue";
import Size from "./Size.vue";
import Owner from "./Owner.vue";
import Status from "./Status.vue";
import Blueprints from "./Blueprints.vue";
import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useBundlesStore } from "@/store/bundles";

const drawerStore = useDrawerStore();
const bundlesStore = useBundlesStore();

const { activeItem: bundle } = storeToRefs(bundlesStore);

const isActive = computed((): boolean => {
  return drawerStore.isDrawerActive(Drawer.Bundle) || false;
});

const onShowUpdate = () => {
  drawerStore.setActiveDrawer(null);
};
</script>
