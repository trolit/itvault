<template>
  <div class="sider">
    <div class="wrapper">
      <n-divider dashed> Variants </n-divider>

      <n-timeline v-if="!isLoading">
        <n-timeline-item>
          <template #default>
            <n-button size="small" type="success">
              <n-icon :component="AddIcon" :size="25" />
            </n-button>
          </template>
        </n-timeline-item>

        <n-timeline-item
          v-for="({ id, name, createdAt, size }, index) in variants"
          :key="index"
        >
          <template #default>
            <n-button @click="workspacesStore.setVariantTab(id)">
              {{ name }}
            </n-button>

            <div>
              <small>{{ dateService.format(createdAt) }}</small>
            </div>

            <n-gradient-text type="warning" :size="12">
              ({{ size.value }}{{ size.unit }})
            </n-gradient-text>
          </template>
        </n-timeline-item>
      </n-timeline>

      <n-spin v-else size="medium" />

      <n-divider dashed> Actions </n-divider>

      <div>
        <n-button :disabled="isBundleDrawerActive" @click="toggleNotesDrawer">
          Notes
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NIcon,
  NSpin,
  NButton,
  NDivider,
  NTimeline,
  NTimelineItem,
  NGradientText,
} from "naive-ui";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { Add as AddIcon } from "@vicons/carbon";

import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useGeneralStore } from "@/store/general";
import { useVariantsStore } from "@/store/variants";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineWatchers } from "@/helpers/defineWatchers";
import { useDateService } from "@/services/useDateService";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";

const isLoading = ref(false);
const dateService = useDateService();
const drawerStore = useDrawerStore();
const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();
const generalStore = useGeneralStore();

const { activeFileTab } = storeToRefs(workspacesStore);

const variants = computed((): IVariantDto[] => {
  const tab = workspacesStore.activeFileTab;

  if (!tab) {
    return [];
  }

  return tab.variantTabs.map(({ variant }) => variant);
});

const isBundleDrawerActive = computed(() => {
  return drawerStore.isDrawerActive(Drawer.Bundle) || false;
});

function toggleNotesDrawer() {
  if (generalStore.isSiderCollapsed) {
    generalStore.toggleSider();
  }

  drawerStore.setActiveDrawer(Drawer.Notes);
}

defineWatchers({
  activeFileTab: {
    source: activeFileTab,
    handler: async () => {
      if (!variants.value.length) {
        isLoading.value = true;

        try {
          await variantsStore.getAll();
        } catch (error) {
          console.log(error);
        } finally {
          isLoading.value = false;
        }
      }
    },
    options: {
      immediate: true,
    },
  },
});
</script>
