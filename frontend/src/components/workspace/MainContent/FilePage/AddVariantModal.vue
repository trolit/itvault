<template>
  <n-modal
    segmented
    title="New variant"
    preset="card"
    :bordered="true"
    :mask-closable="false"
    :style="{ width: '100vh' }"
  >
    Upload

    <template #footer>
      <n-button
        :loading="isLoading"
        :disabled="data.length === 0"
        @click="upload"
      >
        Upload 🚀
      </n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useFilesStore } from "@/store/files";
import { NModal, NButton, type UploadFileInfo } from "naive-ui";

const filesStore = useFilesStore();

const isLoading = ref(false);
const data: Ref<UploadFileInfo[]> = ref([]);

const emit = defineEmits(["on-upload"]);

async function upload() {
  isLoading.value = true;

  const formData = new FormData();

  // formData.append(baseUploadDir, file);

  try {
    await filesStore.store(formData);

    emit("on-upload");
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
