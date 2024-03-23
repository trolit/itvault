<template>
  <div class="blueprint">
    <n-card :title="value.name" :bordered="false">
      <template #header>
        <div class="thumbnail" :style="{ backgroundColor: value.color }" />

        <n-tag>{{ value.color }}</n-tag>
      </template>

      <template #header-extra>
        {{ value.name }}
      </template>

      <n-tag v-if="value.isDeleted" type="error">
        <strong>Note:</strong> This blueprint is not available
      </n-tag>

      <template v-else>
        <n-button
          v-if="!value.files.length"
          text
          :loading="isLoading"
          :disabled="isLoading"
          class="load-files-button"
          @click="fetchFiles"
        >
          <template #icon>
            <n-icon :size="20" :component="PreviewIcon" />
          </template>

          load files
        </n-button>

        <div v-else class="files">
          <n-card
            v-for="file in value.files"
            :key="file.fileId"
            class="file-card"
            @click="openFile(file)"
          >
            <em>{{ file.name }}</em>

            <div class="tags">
              <n-tag type="info">{{ file.version }}</n-tag>

              <n-tag v-if="file.isDeleted" type="error">removed</n-tag>
            </div>
          </n-card>
        </div>
      </template>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from "vue";
import { NCard, NTag, NButton, NIcon } from "naive-ui";
import { Magnify as PreviewIcon } from "@vicons/carbon";

import { useFilesStore } from "@/store/files";
import { useBundlesStore } from "@/store/bundles";
import { useGeneralStore } from "@/store/general";
import { LoadingState } from "@/types/enums/LoadingState";
import type { BundleBlueprint } from "@/types/BundleBlueprint";
import type { IBundleFileDTO } from "@shared/types/DTOs/Bundle";

const props = defineProps({
  value: {
    type: Object as PropType<BundleBlueprint>,
    required: true,
  },
});

const isLoading = ref(false);
const filesStore = useFilesStore();
const generalStore = useGeneralStore();
const bundlesStore = useBundlesStore();

async function fetchFiles() {
  isLoading.value = true;

  try {
    await bundlesStore.getFiles(props.value.id);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

async function openFile(file: IBundleFileDTO) {
  generalStore.setLoadingState(LoadingState.Start);

  try {
    await filesStore.setActiveTabWithBundle({
      bundleFile: file,
      blueprintId: props.value.id,
    });

    generalStore.setLoadingState(LoadingState.Finish);
  } catch (error) {
    console.log(error);

    generalStore.setLoadingState(LoadingState.Error);
  }
}
</script>
