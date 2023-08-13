<template>
  <div class="files-tab">
    <div class="header">
      <n-button type="warning" size="small">
        <n-icon :component="ResetIcon" :size="20" />
      </n-button>

      <!-- @TODO create common component -->
      <n-input clearable show-count placeholder="Type name">
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>
    </div>

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
import { NIcon, NInput, NButton, NScrollbar, NSpin } from "naive-ui";
import { Reset as ResetIcon, Search as SearchIcon } from "@vicons/carbon";

import { useFilesStore } from "@/store/file";
import FileHierarchy from "./FileHierarchy.vue";
import { useWorkspacesStore } from "@/store/workspace";

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
@/store/file@/store/workspace
