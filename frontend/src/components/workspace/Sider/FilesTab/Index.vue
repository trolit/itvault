<template>
  <div class="files-tab">
    <toolbar input-placeholder="Type name" />

    <n-scrollbar>
      <file-hierarchy v-if="!isLoading" :data="workspacesStore.tree" />

      <div v-else class="spinner">
        <n-spin />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { NScrollbar, NSpin } from "naive-ui";

import { useFilesStore } from "@/store/files";
import FileHierarchy from "./FileHierarchy.vue";
import { useWorkspacesStore } from "@/store/workspaces";
import Toolbar from "@/components/workspace/Sider/Toolbar.vue";

const isLoading = ref(false);
const filesStore = useFilesStore();
const workspacesStore = useWorkspacesStore();

onBeforeMount(async () => {
  if (workspacesStore.tree.length === 0) {
    await initTree();

    return;
  }
});

async function initTree() {
  isLoading.value = true;

  try {
    await workspacesStore.getTree({ relativePath: filesStore.ROOT });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
