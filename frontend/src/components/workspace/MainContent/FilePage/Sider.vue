<template>
  <div class="sider">
    <div class="wrapper">
      <n-card :bordered="false">
        <n-text depth="3">Variants</n-text>

        <n-timeline v-if="!isLoading" item-placement="right">
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
              <n-gradient-text type="warning" :size="14">
                {{ size.value }}{{ size.unit }}
              </n-gradient-text>

              <n-divider vertical />

              <n-button @click="variantsStore.setActiveTab(id)" tertiary>
                {{ name }}
              </n-button>

              <div>
                <n-text :depth="3" :style="{ fontSize: '13px' }">
                  <small>
                    {{ dateService.format(createdAt, "DD-MM-YYYY HH:mm") }}
                  </small>
                </n-text>
              </div>

              <n-space
                justify="end"
                align="center"
                :style="{ marginTop: '5px' }"
              >
                <require-permission :permission="Permission.UpdateVariantName">
                  <n-button text @click="variantToEditId = id">
                    <n-icon :component="EditIcon" :size="20" />
                  </n-button>
                </require-permission>

                <require-permission :permission="Permission.DeleteVariant">
                  <n-popconfirm @positive-click="deleteVariant(id)">
                    <template #trigger>
                      <n-button text type="error">
                        <n-icon :component="DeleteIcon" :size="20" />
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

        <n-divider />

        <n-text depth="3">Actions</n-text>

        <div>
          <n-button :disabled="isBundleDrawerActive" @click="toggleNotesDrawer">
            Notes
          </n-button>
        </div>
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
import {
  Add as AddIcon,
  Pen as EditIcon,
  TrashCan as DeleteIcon,
} from "@vicons/carbon";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { computed, onBeforeMount, ref } from "vue";

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
import LoadingSection from "@/components/common/LoadingSection.vue";
import RequirePermission from "@/components/common/RequirePermission.vue";

const route = useRoute();
const filesStore = useFilesStore();
const dateService = useDateService();
const drawerStore = useDrawerStore();
const generalStore = useGeneralStore();
const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();

const { activeVariantId } = storeToRefs(variantsStore);
const { activeFileId, activeTabVariants: variants } = storeToRefs(filesStore);

const isLoading = ref(false);
const variantToEditId = ref("");
const variantToDeleteId = ref("");
const isAddVariantModalVisible = ref(false);
let variantIdFromUrl: string | null = "";

onBeforeMount(async () => {
  variantIdFromUrl = workspacesStore.getUrlSearchParamValue(route, "variantId");
});

defineWatchers({
  activeFileId: {
    source: activeFileId,
    handler: async () => {
      await loadVariantsIfNotFetchedYet();

      if (variantIdFromUrl) {
        variantsStore.setActiveTab(variantIdFromUrl);

        variantIdFromUrl = null;
      } else if (!activeVariantId.value) {
        variantsStore.setActiveTab(variants.value[0].id);
      }
    },
    options: {
      immediate: true,
    },
  },

  activeVariantId: {
    source: activeVariantId,
    handler: (variantId: string | undefined) => {
      if (!variantId) {
        return;
      }

      variantsStore.setActiveTab(variantId);
    },
  },
});

const isBundleDrawerActive = computed(() => {
  return drawerStore.isDrawerActive(Drawer.Bundle) || false;
});

function toggleNotesDrawer() {
  if (workspacesStore.isGeneralSiderCollapsed) {
    workspacesStore.toggleGeneralSider();
  }

  drawerStore.setActiveDrawer(Drawer.Notes);
}

async function loadVariantsIfNotFetchedYet() {
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
}

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
