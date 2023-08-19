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
import { Magnify as PreviewIcon } from "@vicons/carbon";
import { NCard, NTag, NButton, NIcon, useLoadingBar } from "naive-ui";

import { useBundlesStore } from "@/store/bundles";
import { useWorkspacesStore } from "@/store/workspaces";
import type { BundleBlueprint } from "@/types/BundleBlueprint";
import type { IBundleFileDto } from "@shared/types/dtos/IBundleFileDto";

const props = defineProps({
  value: {
    type: Object as PropType<BundleBlueprint>,
    required: true,
  },
});

const isLoading = ref(false);
const loadingBar = useLoadingBar();
const bundlesStore = useBundlesStore();
const workspacesStore = useWorkspacesStore();

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

async function openFile(file: IBundleFileDto) {
  loadingBar.start();

  try {
    await workspacesStore.setFileTabFromBundle(file, props.value.id);

    loadingBar.finish();
  } catch (error) {
    console.log(error);

    loadingBar.error();
  }
}
</script>
