<template>
  <div class="variants-step">
    <div class="selected-items">
      <n-scrollbar>
        <n-card
          v-for="(blueprint, index) in selectedBlueprints"
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

          <div v-if="!wasBlueprintViewed(blueprint.id)" class="require-preview">
            (requires preview)
          </div>
        </n-card>
      </n-scrollbar>
    </div>

    <n-divider vertical />

    <div class="items">
      <n-scrollbar trigger="none">
        <loading-section v-if="isLoading" />

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
                    @click="file.selectedVariantId = variant.id"
                  >
                    {{ variant.name }}
                  </n-button>
                </n-button-group>
              </div>
            </template>

            <template #footer>
              <n-alert
                v-if="hasVariantConflict(file.id, file.selectedVariantId)"
                type="error"
              >
                This variant is conflicting with variant selected in
                <strong>{{ conflictingData.blueprint }}</strong> ({{
                  conflictingData.variant
                }}) 😢. To fix this issue and generate bundle please:

                <ul>
                  <li>choose same variant (if possible)</li>
                  <li>remove one of conflicting blueprints</li>
                </ul>
              </n-alert>
            </template>
          </n-card>
        </div>
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NCard,
  NIcon,
  NAlert,
  NButton,
  NDivider,
  NScrollbar,
  NButtonGroup,
} from "naive-ui";
import { ViewFilled as ViewIcon } from "@vicons/carbon";
import { ref, type PropType, computed, watch, toRefs } from "vue";

import { useFilesStore } from "@/store/files";
import type { BundleModalItem } from "@/types/BundleModalItem";
import type { IBlueprintDTO } from "@shared/types/DTOs/Blueprint";
import LoadingSection from "@/components/common/LoadingSection.vue";

const props = defineProps({
  items: {
    type: Object as PropType<BundleModalItem[]>,
    required: true,
  },

  selectedBlueprints: {
    type: Object as PropType<IBlueprintDTO[]>,
    required: true,
  },
});

const emits = defineEmits(["add-files", "update:is-variant-conflict"]);

const isLoading = ref(false);
const filesStore = useFilesStore();
const activeItemIndex = ref(0);
const conflictingData = ref({
  blueprint: "",
  variant: "",
});
const { items, selectedBlueprints } = toRefs(props);

const activeItem = computed(() => {
  return items.value[activeItemIndex.value];
});

watch(
  activeItemIndex,
  () => {
    fetchFiles();
  },
  { immediate: true }
);

function wasBlueprintViewed(id: number) {
  return items.value.find(
    ({ blueprint, files }) => blueprint.id === id && files.length
  );
}

function isVariantSelected(fileId: number, variantId: string) {
  return !!activeItem.value.files.find(
    file => file.id === fileId && file.selectedVariantId === variantId
  );
}

function hasVariantConflict(fileId: number, selectedVariantId: string) {
  const itemsIncludingSameFile = items.value.filter(
    item =>
      item.files.some(file => file.id === fileId) &&
      item.blueprint.id !== activeItem.value.blueprint.id
  );

  if (!itemsIncludingSameFile.length) {
    emits("update:is-variant-conflict", false);

    return false;
  }

  for (const item of itemsIncludingSameFile) {
    const file = item.files.find(file => file.id === fileId);

    if (!file) {
      continue;
    }

    if (file.selectedVariantId !== selectedVariantId) {
      const variant = file.variants.find(
        variant => variant.id === file.selectedVariantId
      );

      conflictingData.value = {
        blueprint: item.blueprint.name,
        variant: variant?.name || "",
      };

      emits("update:is-variant-conflict", true);

      return true;
    }
  }

  emits("update:is-variant-conflict", false);

  return false;
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
