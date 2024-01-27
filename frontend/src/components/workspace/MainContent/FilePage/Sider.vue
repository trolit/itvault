<template>
  <div class="sider">
    <div class="wrapper">
      <n-card :bordered="false">
        <n-space justify="space-between">
          <require-permission :permission="Permission.UpdateFilename">
            <n-button
              round
              dashed
              size="small"
              :disabled="isDeletingFile"
              @click="isRenameFileModalVisible = true"
            >
              Rename
            </n-button>
          </require-permission>

          <require-permission :permission="Permission.DeleteFile">
            <n-popconfirm @positive-click="deleteFile(activeFileId)">
              <template #trigger>
                <n-button
                  size="small"
                  round
                  dashed
                  type="error"
                  :loading="isDeletingFile"
                >
                  Delete
                </n-button>
              </template>

              Are you sure? This action cannot be undone.
            </n-popconfirm>
          </require-permission>
        </n-space>

        <n-divider />

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
              <n-ellipsis :line-clamp="1">
                {{ name }}
              </n-ellipsis>

              <div>
                <n-gradient-text type="warning">
                  {{ formatBytes(size.value) }}
                </n-gradient-text>
              </div>

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
                <n-button
                  text
                  @click="variantsStore.setActiveTab(id)"
                  :disabled="isVariantVisible(id)"
                >
                  <n-icon :component="ViewIcon" :size="20" />
                </n-button>

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

        <div>
          <n-button
            round
            :disabled="isBundleDrawerActive"
            @click="toggleNotesDrawer"
          >
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

    <rename-file-modal
      v-if="isRenameFileModalVisible"
      :is-visible="true"
      :file-id="activeFileId"
      @update:is-visible="isRenameFileModalVisible = false"
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
  NEllipsis,
  NTimeline,
  NPopconfirm,
  NTimelineItem,
  NGradientText,
} from "naive-ui";
import {
  Add as AddIcon,
  Pen as EditIcon,
  View as ViewIcon,
  TrashCan as DeleteIcon,
} from "@vicons/carbon";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import { Drawer } from "@/types/enums/Drawer";
import { useFilesStore } from "@/store/files";
import { useDrawerStore } from "@/store/drawer";
import AddVariantModal from "./AddVariantModal.vue";
import { formatBytes } from "@/helpers/formatBytes";
import { useVariantsStore } from "@/store/variants";
import { useWorkspacesStore } from "@/store/workspaces";
import RenameVariantModal from "./RenameVariantModal.vue";
import { defineWatchers } from "@/helpers/defineWatchers";
import { useDateService } from "@/services/useDateService";
import { Permission } from "@shared/types/enums/Permission";
import { defineApiRequest } from "@/helpers/defineApiRequest";
import LoadingSection from "@/components/common/LoadingSection.vue";
import RequirePermission from "@/components/common/RequirePermission.vue";
import RenameFileModal from "@/components/workspace/Sider/FilesTab/RenameFileModal.vue";

const filesStore = useFilesStore();
const dateService = useDateService();
const drawerStore = useDrawerStore();
const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();

const {
  activeTab,
  activeFileId,
  activeTabVariants: variants,
} = storeToRefs(filesStore);
const { activeVariantId } = storeToRefs(variantsStore);

const isLoading = ref(false);
const variantToEditId = ref("");
const isAddVariantModalVisible = ref(false);
const isRenameFileModalVisible = ref(false);

defineWatchers({
  activeFileId: {
    source: activeFileId,
    handler: async () => {
      await loadVariantsIfNotFetchedYet();

      if (!activeVariantId.value) {
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

function isVariantVisible(variantId: string) {
  if (!activeTab.value) {
    return false;
  }

  return activeTab.value.variantTabs.some(
    variantTab => variantTab.variant.id === variantId && variantTab.isVisible
  );
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

const { onSubmit: deleteVariant } = defineApiRequest<string>({
  callHandler: async (printSuccess, variantId) => {
    await variantsStore.delete(variantId);

    printSuccess("Variant removed!");
  },
  errorHandler: (error, printError) => {
    printError("Failed to remove variant!");
  },
});

const { isLoading: isDeletingFile, onSubmit: deleteFile } =
  defineApiRequest<number>({
    callHandler: async (printSuccess, fileId) => {
      await filesStore.delete(fileId);

      filesStore.closeTab(fileId);

      printSuccess("File removed!");
    },
    errorHandler: (error, printError) => {
      printError("Failed to remove file!");
    },
  });
</script>
