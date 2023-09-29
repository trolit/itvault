<template>
  <div class="sider">
    <div class="wrapper">
      <n-card :bordered="false">
        <n-text depth="3">/actions/</n-text>

        <div>
          <n-button :disabled="isBundleDrawerActive" @click="toggleNotesDrawer">
            Notes
          </n-button>
        </div>

        <br />

        <n-text depth="3">/variants/</n-text>

        <n-timeline v-if="!isLoading">
          <n-timeline-item type="info" line-type="dashed">
            <template #default>
              <n-button
                size="small"
                type="info"
                @click="isAddVariantModalVisible = true"
              >
                <n-icon :component="AddIcon" :size="25" />
              </n-button>
            </template>
          </n-timeline-item>

          <n-timeline-item
            v-for="({ id, name, createdAt, size }, index) in variants"
            :key="index"
          >
            <template #default>
              <n-button @click="workspacesStore.setVariantTab(id)" tertiary>
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
      </n-card>
    </div>

    <add-variant-modal
      :is-visible="isAddVariantModalVisible"
      @update:is-visible="isAddVariantModalVisible = $event"
    />
  </div>
</template>

<script setup lang="ts">
import {
  NIcon,
  NSpin,
  NText,
  NCard,
  NButton,
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
import AddVariantModal from "./AddVariantModal.vue";
import { useVariantsStore } from "@/store/variants";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineWatchers } from "@/helpers/defineWatchers";
import { useDateService } from "@/services/useDateService";
import type { IVariantDto } from "@shared/types/dtos/IVariantDto";

const isLoading = ref(false);
const isAddVariantModalVisible = ref(false);

const dateService = useDateService();
const drawerStore = useDrawerStore();
const generalStore = useGeneralStore();
const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();

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
