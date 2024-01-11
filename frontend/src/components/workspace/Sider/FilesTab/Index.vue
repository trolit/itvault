<template>
  <div class="files-tab">
    <toolbar
      :is-loading="isLoading"
      input-placeholder="Type name"
      @add-item="isUploadFilesModalVisible = true"
      @reload="initTree(true)"
    />

    <n-scrollbar>
      <n-alert
        v-show="isFileUploadAlertVisible"
        class="file-upload-alert"
        type="info"
        closable
        @close="isFileUploadAlertVisible = false"
      >
        Use
        <n-button type="warning" size="tiny" disabled>
          <n-icon :component="ResetIcon" />
        </n-button>
        button (or refresh page) to view uploaded files.
      </n-alert>

      <file-hierarchy v-if="!isLoading" />

      <loading-section v-else />
    </n-scrollbar>

    <upload-files-modal
      :is-visible="isUploadFilesModalVisible"
      @on-upload="onUpload"
      @update:is-visible="isUploadFilesModalVisible = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onBeforeMount, ref } from "vue";
import { Reset as ResetIcon } from "@vicons/carbon";
import { NScrollbar, NAlert, NButton, NIcon } from "naive-ui";

import { useFilesStore } from "@/store/files";
import FileHierarchy from "./FileHierarchy.vue";
import UploadFilesModal from "./UploadFilesModal.vue";
import type { IFileDTO } from "@shared/types/DTOs/File";
import { useWorkspacesStore } from "@/store/workspaces";
import Toolbar from "@/components/workspace/Sider/Toolbar.vue";
import LoadingSection from "@/components/common/LoadingSection.vue";

const route = useRoute();
const filesStore = useFilesStore();
const workspacesStore = useWorkspacesStore();

defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:is-loading"]);

const isFileUploadAlertVisible = ref(false);
const isUploadFilesModalVisible = ref(false);

onBeforeMount(async () => {
  if (workspacesStore.tree.length === 0) {
    await initTree();

    return;
  }
});

async function initTree(isReload?: boolean) {
  emit("update:is-loading", true);

  const value = workspacesStore.getUrlSearchParamValue(route, "fileId");

  try {
    let file: IFileDTO | null = null;

    if (value && !isReload) {
      file = await initTreeByProvidedFileId(parseInt(value));
    } else {
      await workspacesStore.getTree(
        { relativePath: filesStore.ROOT },
        isReload
      );
    }

    workspacesStore.initTree();

    if (file) {
      workspacesStore.setTreeDataExpandedKeysByRelativePath(file.relativePath);

      filesStore.setActiveTab(file);

      // @NOTE consider to refactor variants to create variant tabs in different way (?)
    }
  } catch (error) {
    console.log(error);
  } finally {
    emit("update:is-loading", false);
  }
}

function onUpload() {
  isUploadFilesModalVisible.value = false;

  isFileUploadAlertVisible.value = true;
}

async function initTreeByProvidedFileId(fileId: number) {
  filesStore.activeFileId = fileId;

  const file = await filesStore.getById(fileId);

  const splitRelativePath = file.relativePath.split("/");
  const splitRelativePathLength = splitRelativePath.length;

  const promises = [];

  for (let index = 0; index < splitRelativePathLength; index++) {
    const relativePath =
      index === 0
        ? filesStore.ROOT
        : splitRelativePath.slice(0, index + 1).join("/");

    const promise = workspacesStore.getTree({ relativePath });

    promises.push(promise);
  }

  await Promise.all(promises);

  return file;
}
</script>
