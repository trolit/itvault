<template>
  <div class="variants-step">
    <div class="selected-items">
      <n-tag :bordered="false" type="info">
        <n-icon :size="20" :component="InformationIcon" /> Completed ({{
          selectedBlueprints.length
        }})
      </n-tag>

      <n-scrollbar>
        <n-card v-for="blueprint in selectedBlueprints" :key="blueprint.id">
          <div
            class="thumbnail"
            :style="{ backgroundColor: blueprint.color }"
          />

          {{ blueprint.name }}
        </n-card>
      </n-scrollbar>
    </div>

    <n-divider vertical />

    <div class="items">
      <n-scrollbar trigger="none">
        <n-spin v-if="isLoading" />

        <div class="wrapper" v-else>
          <n-card v-for="item in blueprintFiles" :key="item.id">
            <div class="name">
              {{ item.relativePath }}/{{ item.originalFilename }}
            </div>

            <div>
              Select variant!

              <n-button-group>
                <n-button v-for="variant in item.variants" :key="variant.id">
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
import { Information as InformationIcon } from "@vicons/carbon";
import {
  NCard,
  NTag,
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

const blueprintFiles = computed(() => {
  const files = props.files.find(
    (collection, index) => index === activeBlueprintIndex.value
  );

  if (!files || !files.length) {
    fetchFiles();
  }

  return files || [];
});

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

    emits("add-files", data);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
