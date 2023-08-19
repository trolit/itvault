<template>
  <!-- @TODO notes drawer -->
  <!-- @TODO overflow: auto for timeline! -->
  <div class="card-header">
    <div class="timeline-wrapper" style="overflow: auto">
      <n-timeline v-if="!isLoading" horizontal>
        <n-timeline-item
          v-for="({ id, name, createdAt, size }, index) in variants"
          :key="index"
        >
          <template #default>
            <n-button @click="workspacesStore.setVariantTab(id)">
              {{ name }}
            </n-button>

            <div>
              <small>{{ formatDate(createdAt) }}</small>
            </div>

            <n-gradient-text type="warning" :size="12">
              ({{ size.value }}{{ size.unit }})
            </n-gradient-text>
          </template>
        </n-timeline-item>

        <n-timeline-item>
          <template #default>
            <n-button type="info" dashed>
              <n-icon :component="AddIcon" :size="25" />
            </n-button>
          </template>
        </n-timeline-item>
      </n-timeline>

      <n-spin v-else size="medium" />
    </div>

    <div class="actions">
      <n-button :disabled="isBundleDrawerActive" @click="toggleNotesDrawer">
        Notes
        <span v-if="isBundleDrawerActive">
          &nbsp; - not available in bundle preview
        </span>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { Add as AddIcon } from "@vicons/carbon";
import {
  NIcon,
  NSpin,
  NButton,
  NTimeline,
  NTimelineItem,
  NGradientText,
} from "naive-ui";

import { Drawer } from "@/types/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useVariantsStore } from "@/store/variants";
import formatDate from "@/helpers/dayjs/formatDate";
import { useWorkspacesStore } from "@/store/workspaces";
import { usePreferencesStore } from "@/store/preferences";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";

const isLoading = ref(false);
const drawerStore = useDrawerStore();
const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();
const preferencesStore = usePreferencesStore();

const variants = computed((): IVariantDto[] => {
  const tab = workspacesStore.activeFileTabValue;

  if (!tab) {
    return [];
  }

  return tab.variantTabs.map(({ variant }) => variant);
});

const isBundleDrawerActive = computed(() => {
  return drawerStore.isDrawerActive(Drawer.Bundle) || false;
});

onBeforeMount(async () => {
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
});

function toggleNotesDrawer() {
  if (preferencesStore.isSiderCollapsed) {
    preferencesStore.toggleSider();
  }

  drawerStore.setActiveDrawer(Drawer.Notes);
}
</script>
