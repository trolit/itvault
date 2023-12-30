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
          <n-timeline-item type="success" line-type="dashed">
            <template #default>
              <n-button
                size="small"
                type="success"
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
              <n-button @click="variantsStore.setActiveTab(id)" tertiary>
                {{ name }}
              </n-button>

              <n-divider vertical />

              <require-permission :permission="Permission.UpdateVariantName">
                <n-button text @click="variantToEditId = id">
                  <small>Rename</small>
                </n-button>
              </require-permission>

              <div>
                <n-space justify="center">
                  <n-gradient-text type="info" :size="12">
                    {{ size.value }}{{ size.unit }}
                  </n-gradient-text>

                  <n-text :depth="3" :style="{ fontSize: '13px' }">
                    <small>
                      {{ dateService.format(createdAt, "DD-MM-YYYY HH:mm") }}
                    </small>
                  </n-text>
                </n-space>
              </div>

              <n-space justify="end">
                <require-permission :permission="Permission.DeleteVariant">
                  <n-popconfirm @positive-click="deleteVariant(id)">
                    <template #trigger>
                      <n-button
                        text
                        type="error"
                        :loading="variantToDeleteId === id"
                      >
                        <small>DELETE</small>
                      </n-button>
                    </template>

                    <small>
                      Do you really want to remove this variant? This action
                      cannot be undone!
                    </small>
                  </n-popconfirm>
                </require-permission>
              </n-space>
            </template>
          </n-timeline-item>
        </n-timeline>

        <loading-section v-else spin-size="medium" />
      </n-card>
    </div>

    <add-variant-modal
      :is-visible="isAddVariantModalVisible"
      @update:is-visible="isAddVariantModalVisible = $event"
    />

    <rename-variant-modal
      :is-visible="!!variantToEditId"
      :variant-id="variantToEditId"
      @update:is-visible="variantToEditId = ''"
    />
  </div>
</template>

<script setup lang="ts">
import {
  NIcon,
  NText,
  NCard,
  NSpace,
  NButton,
  NDivider,
  NTimeline,
  NPopconfirm,
  NTimelineItem,
  NGradientText,
} from "naive-ui";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { Add as AddIcon } from "@vicons/carbon";

import { Drawer } from "@/types/enums/Drawer";
import { useFilesStore } from "@/store/files";
import { useDrawerStore } from "@/store/drawer";
import { useGeneralStore } from "@/store/general";
import AddVariantModal from "./AddVariantModal.vue";
import { useVariantsStore } from "@/store/variants";
import { useWorkspacesStore } from "@/store/workspaces";
import RenameVariantModal from "./RenameVariantModal.vue";
import { defineWatchers } from "@/helpers/defineWatchers";
import { useDateService } from "@/services/useDateService";
import { Permission } from "@shared/types/enums/Permission";
import type { IVariantDTO } from "@shared/types/DTOs/Variant";
import LoadingSection from "@/components/common/LoadingSection.vue";
import RequirePermission from "@/components/common/RequirePermission.vue";

const route = useRoute();
const filesStore = useFilesStore();
const dateService = useDateService();
const drawerStore = useDrawerStore();
const generalStore = useGeneralStore();
const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();

const isLoading = ref(false);
const variantToEditId = ref("");
const variantToDeleteId = ref("");
const isAddVariantModalVisible = ref(false);
const { activeTab } = storeToRefs(filesStore);

const variants = computed((): IVariantDTO[] => {
  return activeTab.value
    ? activeTab.value.variantTabs.map(({ variant }) => variant)
    : [];
});

const isBundleDrawerActive = computed(() => {
  return drawerStore.isDrawerActive(Drawer.Bundle) || false;
});

function toggleNotesDrawer() {
  if (workspacesStore.isSiderCollapsed) {
    workspacesStore.toggleSider();
  }

  drawerStore.setActiveDrawer(Drawer.Notes);
}

defineWatchers({
  activeTab: {
    source: activeTab,
    handler: async () => {
      if (!variants.value.length) {
        isLoading.value = true;

        const variantId = workspacesStore.getUrlSearchParamValue(
          route,
          "variantId"
        );
        const blueprintId = workspacesStore.getUrlSearchParamValue(
          route,
          "blueprintId"
        );

        try {
          const variants = await variantsStore.getAll();

          variantsStore.overwriteActiveInformationIfPossible({
            variant: true,
          });

          // @TODO handle case when variantId or blueprintId do not exist
          if (
            variantId &&
            typeof variantId === "string" &&
            variants.some(variant => variant.id === variantId)
          ) {
            variantsStore.setActiveTab(variantId);

            if (blueprintId && typeof blueprintId === "string") {
              variantsStore.setActiveTabBlueprint(parseInt(blueprintId));
            }
          }
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

async function deleteVariant(id: string) {
  if (variantToDeleteId.value) {
    return;
  }

  variantToDeleteId.value = id;

  try {
    await variantsStore.delete(id);

    generalStore.messageProvider.success("Variant removed!");
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.success("Failed to remove variant!");
  } finally {
    variantToDeleteId.value = "";
  }
}
</script>
