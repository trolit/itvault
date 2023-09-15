<template>
  <div class="files-tab">
    <toolbar
      input-placeholder="Type name"
      @add-item="isUploadFilesModalVisible = true"
    />

    <n-scrollbar>
      <file-hierarchy v-if="!isLoading" :data="workspacesStore.tree" />

      <div v-else class="spinner">
        <n-spin />
      </div>
    </n-scrollbar>

    <upload-files-modal v-model:show="isUploadFilesModalVisible" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { NScrollbar, NSpin } from "naive-ui";

import { useFilesStore } from "@/store/files";
import FileHierarchy from "./FileHierarchy.vue";
import UploadFilesModal from "./UploadFilesModal.vue";
import { useWorkspacesStore } from "@/store/workspaces";
import Toolbar from "@/components/workspace/Sider/Toolbar.vue";

const filesStore = useFilesStore();
const workspacesStore = useWorkspacesStore();

defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:is-loading"]);

const isUploadFilesModalVisible = ref(false);

onBeforeMount(async () => {
  if (workspacesStore.tree.length === 0) {
    await initTree();

    return;
  }
});

async function initTree() {
  emit("update:is-loading", true);

  try {
    await workspacesStore.getTree({ relativePath: filesStore.ROOT });
  } catch (error) {
    console.log(error);
  } finally {
    emit("update:is-loading", false);
  }
}
</script>
