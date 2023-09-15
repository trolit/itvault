<template>
  <n-modal
    segmented
    title="Upload files"
    preset="card"
    :bordered="true"
    :style="{ width: '100vh' }"
    :mask-closable="false"
  >
    <n-upload
      multiple
      directory-dnd
      v-model:file-list="data"
      accept="type/text"
      :max="30"
    >
      <n-upload-dragger>
        <n-space vertical>
          <n-icon size="68" :depth="3" :component="UploadIcon" />

          <n-text> Click or drag files (or directories) to this area </n-text>

          <n-p depth="3">
            Strictly prohibit from uploading sensitive information.
          </n-p>
        </n-space>
      </n-upload-dragger>
    </n-upload>

    <template #footer>
      <n-button :disabled="data.length === 0">Upload</n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NP,
  NIcon,
  NText,
  NSpace,
  NModal,
  NButton,
  NUpload,
  NUploadDragger,
  type UploadFileInfo,
} from "naive-ui";
import { ref, type Ref } from "vue";
import { Add as UploadIcon } from "@vicons/carbon";

const data: Ref<UploadFileInfo[]> = ref([]);
</script>
