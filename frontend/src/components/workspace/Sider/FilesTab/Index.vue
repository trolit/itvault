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

      <file-hierarchy v-if="!isLoading" :data="workspacesStore.tree" />

      <loading-section v-else />
    </n-scrollbar>

    <upload-files-modal
      v-model:show="isUploadFilesModalVisible"
      @on-upload="onUpload"
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
import Toolbar from "@/components/workspace/Sider/Toolbar.vue";
import LoadingSection from "@/components/common/LoadingSection.vue";

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

  try {
    // @TODO when loading files tab with activeFileId in query params - load files from activeFile path
    await workspacesStore.getTree({ relativePath: filesStore.ROOT }, isReload);
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
</script>
