<template>
  <div class="variants-step">
    <div class="selected-items">
      <n-scrollbar>
        <n-card
          v-for="(blueprint, index) in selectedBlueprints"
          :key="blueprint.id"
          @click="activeBlueprintIndex = index"
        >
          <div class="blueprint-info">
            <div
              class="thumbnail"
              :style="{ backgroundColor: blueprint.color }"
            />

            {{ blueprint.name }}

            <n-icon
              v-if="activeBlueprintIndex === index"
              :component="ViewIcon"
              :size="20"
            />
          </div>

          <div v-if="!wasBlueprintPreviewed(index)" class="require-preview">
            (requires preview)
          </div>
        </n-card>
      </n-scrollbar>
    </div>

    <n-divider vertical />

    <div class="items">
      <n-scrollbar trigger="none">
        <n-spin v-if="isLoading" />

        <div class="wrapper" v-else-if="activeBlueprint">
          <n-card v-for="item in blueprintFiles" :key="item.id">
            <div class="name">
              {{ item.relativePath }}/{{ item.originalFilename }}
            </div>

            <div>
              <n-button-group>
                <n-button
                  v-for="variant in item.variants"
                  :key="variant.id"
                  :disabled="isVariantSelected(activeBlueprint.id, variant.id)"
                >
                  {{ variant.name }}
                </n-button>
              </n-button-group>
            </div>
          </n-card>
        </div>
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType, computed } from "vue";
import { ViewFilled as ViewIcon } from "@vicons/carbon";
import {
  NCard,
  NIcon,
  NScrollbar,
  NSpin,
  NDivider,
  NButton,
  NButtonGroup,
} from "naive-ui";

import { useFilesStore } from "@/store/files";
import type { AddBundleDto } from "@shared/types/dtos/AddBundleDto";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";
import type { IFileVariantDto } from "@shared/types/dtos/IFileVariantDto";

const isLoading = ref(false);
const filesStore = useFilesStore();
const activeBlueprintIndex = ref(0);

const props = defineProps({
  formData: {
    type: Object as PropType<AddBundleDto>,
    required: true,
  },

  files: {
    type: Object as PropType<IFileVariantDto[][]>,
    required: true,
  },

  selectedBlueprints: {
    type: Object as PropType<IBlueprintDto[]>,
    required: true,
  },
});

const emits = defineEmits(["add-files"]);

const activeBlueprint = computed(() => {
  return props.selectedBlueprints.find(
    (blueprint, index) => index === activeBlueprintIndex.value
  );
});

const blueprintFiles = computed(() => {
  const files = props.files.find(
    (collection, index) => index === activeBlueprintIndex.value
  );

  if (!files || !files.length) {
    fetchFiles();
  }

  return files || [];
});

function wasBlueprintPreviewed(blueprintIndex: number) {
  return props.files[blueprintIndex] !== undefined;
}

function isVariantSelected(blueprintId: number, variantId: string) {
  const formDataValue = props.formData.values.find(
    value => value.blueprintId === blueprintId
  );

  return formDataValue && formDataValue.variantIds.includes(variantId);
}

async function fetchFiles() {
  const blueprint = props.selectedBlueprints.find(
    (blueprint, index) => index === activeBlueprintIndex.value
  );

  if (!blueprint) {
    return;
  }

  isLoading.value = true;

  try {
    const { data } = await filesStore.getAll({ blueprintId: blueprint.id });

    emits("add-files", blueprint.id, data);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
