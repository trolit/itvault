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
import { onBeforeMount, ref } from "vue";
import { Reset as ResetIcon } from "@vicons/carbon";
import { NScrollbar, NAlert, NButton, NIcon } from "naive-ui";

import { useFilesStore } from "@/store/files";
import FileHierarchy from "./FileHierarchy.vue";
import UploadFilesModal from "./UploadFilesModal.vue";
import { useWorkspacesStore } from "@/store/workspaces";
import type { IFileDTO } from "@shared/types/DTOs/File";
import Toolbar from "@/components/workspace/Sider/Toolbar.vue";
import LoadingSection from "@/components/common/LoadingSection.vue";

const filesStore = useFilesStore();
const workspacesStore = useWorkspacesStore();

interface IProps {
  isLoading: boolean;

  isLoadingFileFromUrl: boolean;
}

const props = defineProps<IProps>();

const emit = defineEmits(["update:is-loading"]);

const isFileUploadAlertVisible = ref(false);
const isUploadFilesModalVisible = ref(false);

onBeforeMount(() => {
  if (workspacesStore.tree.length === 0) {
    initTree();
  }
});

async function initTree(isReload?: boolean) {
  emit("update:is-loading", true);

  try {
    if (props.isLoadingFileFromUrl && !isReload) {
      const file = await filesStore.waitForActiveTabFile();

      await getTreeByActiveFile(file);
    } else {
      await workspacesStore.getTree(
        { relativePath: filesStore.ROOT },
        isReload
      );
    }

    workspacesStore.initTree();
  } catch (error) {
    console.log(error);
  } finally {
    emit("update:is-loading", false);
  }

  if (filesStore.activeTab?.file) {
    workspacesStore.setTreeDataExpandedKeysByRelativePath(
      filesStore.activeTab.file.relativePath
    );
  }
}

function onUpload() {
  isUploadFilesModalVisible.value = false;

  isFileUploadAlertVisible.value = true;
}

async function getTreeByActiveFile(file: IFileDTO) {
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
