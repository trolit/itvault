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
            <n-button @click="variantsStore.setActiveTab(id)">
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
      <n-button @click="toggleNotesDrawer">Notes</n-button>
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
import { useFilesStore } from "@/store/files";
import { useVariantsStore } from "@/store/variants";
import formatDate from "@/helpers/dayjs/formatDate";
import { usePreferencesStore } from "@/store/preferences";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";

const isLoading = ref(false);
const filesStore = useFilesStore();
const drawerStore = useDrawerStore();
const variantsStore = useVariantsStore();
const preferencesStore = usePreferencesStore();

onBeforeMount(async () => {
  await fetchVariants();
});

async function fetchVariants() {
  isLoading.value = true;

  try {
    await variantsStore.getAll();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

const variants = computed((): IVariantDto[] => {
  const tab = filesStore.getActiveTab();

  if (!tab) {
    return [];
  }

  return tab.variants.map(({ value }) => value);
});

function toggleNotesDrawer() {
  if (preferencesStore.isSiderCollapsed) {
    preferencesStore.toggleSider();
  }

  drawerStore.setActiveDrawer(Drawer.Notes);
}
</script>
