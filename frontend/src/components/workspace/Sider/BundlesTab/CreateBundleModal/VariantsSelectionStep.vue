<template>
  <div class="variants-step">
    <div class="selected-items">
      <n-scrollbar>
        <n-card
          v-for="(blueprint, index) in selectedBlueprints.value"
          :key="blueprint.id"
          @click="activeItemIndex = index"
        >
          <div class="blueprint-info">
            <div
              class="thumbnail"
              :style="{ backgroundColor: blueprint.color }"
            />

            {{ blueprint.name }}

            <n-icon
              v-if="activeItemIndex === index"
              :component="ViewIcon"
              :size="20"
            />
          </div>

          <div
            v-if="!wasBlueprintPreviewed(blueprint.id)"
            class="require-preview"
          >
            (requires preview)
          </div>
        </n-card>
      </n-scrollbar>
    </div>

    <n-divider vertical />

    <div class="items">
      <n-scrollbar trigger="none">
        <n-spin v-if="isLoading" />

        <div class="wrapper" v-else>
          <n-card v-for="file in activeItem.files" :key="file.id">
            <template #default>
              <div class="name">
                {{ file.relativePath }}/{{ file.originalFilename }}
              </div>

              <div>
                <n-button-group>
                  <n-button
                    v-for="variant in file.variants"
                    :key="variant.id"
                    :disabled="isVariantSelected(file.id, variant.id)"
                  >
                    {{ variant.name }}
                  </n-button>
                </n-button-group>
              </div>
            </template>

            <template #footer>
              <n-alert type="error"> This file is conflicting </n-alert>
            </template>
          </n-card>
        </div>
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType, computed, watch, type Ref } from "vue";
import { ViewFilled as ViewIcon } from "@vicons/carbon";
import {
  NCard,
  NAlert,
  NIcon,
  NScrollbar,
  NSpin,
  NDivider,
  NButton,
  NButtonGroup,
} from "naive-ui";

import { useFilesStore } from "@/store/files";
import type { BundleModalItem } from "@/types/BundleModalItem";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

const props = defineProps({
  items: {
    type: Object as PropType<BundleModalItem[]>,
    required: true,
  },

  selectedBlueprints: {
    type: Object as PropType<Ref<IBlueprintDto[]>>,
    required: true,
  },
});

const emits = defineEmits(["add-files"]);

const isLoading = ref(false);
const filesStore = useFilesStore();
const activeItemIndex = ref(0);

const activeItem = computed(() => {
  return props.items[activeItemIndex.value];
});

watch(
  activeItemIndex,
  () => {
    fetchFiles();
  },
  { immediate: true }
);

function wasBlueprintPreviewed(id: number) {
  return props.items.find(
    ({ blueprint, files }) => blueprint.id === id && files.length
  );
}

function isVariantSelected(fileId: number, variantId: string) {
  return !!activeItem.value.files.find(
    file => file.id === fileId && file.selectedVariantId === variantId
  );
}

async function fetchFiles() {
  const blueprintId = activeItem.value?.blueprint?.id;
  const hasFiles = !!activeItem.value.files.length;

  if (!blueprintId || hasFiles) {
    return;
  }

  isLoading.value = true;

  try {
    const { data } = await filesStore.getAll({
      blueprintId,
    });

    emits("add-files", blueprintId, data);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
