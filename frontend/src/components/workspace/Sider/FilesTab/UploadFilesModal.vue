<template>
  <n-modal
    segmented
    title="Upload files"
    preset="card"
    :bordered="true"
    :mask-closable="false"
    :style="{ width: '100vh' }"
  >
    <n-h3>1. Select files 👀</n-h3>

    <n-upload multiple directory-dnd v-model:file-list="data" :max="30">
      <n-upload-dragger>
        <n-space vertical>
          <n-icon size="68" :depth="3" :component="UploadIcon" />

          <n-text>
            Click to select files (or drag files/directories) to this area
          </n-text>

          <n-p depth="3">
            Strictly prohibit from uploading sensitive information.
          </n-p>
        </n-space>
      </n-upload-dragger>
    </n-upload>

    <n-h3>2. Configure upload location 🛠️</n-h3>

    <div>
      <n-text>Where file(s) should be uploaded?</n-text>

      <br />

      <n-radio-group v-model:value="fileUploadDir">
        <n-space>
          <n-radio label="root" :value="filesStore.ROOT" />

          <n-radio label="custom path" value="other" />
        </n-space>
      </n-radio-group>
    </div>

    <div v-if="!isRootDirectorySelected">
      <n-input-group>
        <n-input-group-label>{{ filesStore.ROOT }}</n-input-group-label>
        <n-input-group-label>/</n-input-group-label>
        <n-input
          v-model:value="customPathValue"
          type="text"
          placeholder="src/example/path"
        />
      </n-input-group>

      <small
        v-if="!isCustomPathEmpty && !isCustomPathValid"
        :style="{ color: '#FFCF40' }"
      >
        Provided path is invalid!
      </small>
    </div>

    <n-h3>3. Upload 🚀</n-h3>

    <n-button
      :loading="isLoading"
      :disabled="
        data.length === 0 ||
        (!isRootDirectorySelected && (!isCustomPathValid || isCustomPathEmpty))
      "
      @click="upload"
    >
      Upload</n-button
    >
  </n-modal>
</template>

<script setup lang="ts">
import {
  NP,
  NH3,
  NIcon,
  NText,
  NInput,
  NSpace,
  NModal,
  NRadio,
  NButton,
  NUpload,
  NInputGroup,
  NRadioGroup,
  NUploadDragger,
  NInputGroupLabel,
  type UploadFileInfo,
} from "naive-ui";
import { ref, type Ref } from "vue";
import { useFilesStore } from "@/store/files";
import { Add as UploadIcon } from "@vicons/carbon";
import { defineComputed } from "@/helpers/defineComputed";

const filesStore = useFilesStore();

const isLoading = ref(false);
const customPathValue = ref("");
const fileUploadDir = ref(filesStore.ROOT);
const data: Ref<UploadFileInfo[]> = ref([]);

const customPathValueRegex = new RegExp(/(^[a-z0-9]+)(\/[a-z0-9-]+)*$/);

const { isRootDirectorySelected, isCustomPathEmpty, isCustomPathValid } =
  defineComputed({
    isRootDirectorySelected() {
      return fileUploadDir.value === filesStore.ROOT;
    },

    isCustomPathEmpty() {
      return !customPathValue.value;
    },

    isCustomPathValid() {
      if (isCustomPathEmpty.value) {
        return true;
      }

      return customPathValueRegex.test(customPathValue.value);
    },
  });

function getBaseUploadDir() {
  return isRootDirectorySelected.value
    ? filesStore.ROOT
    : `${filesStore.ROOT}/${customPathValue.value}`;
}

// @NOTE e.g. (file) -> "fullPath": "/aha.txt" (file from dir) -> "fullPath": "/aha/zxde.txt"
function upload() {
  isLoading.value = true;

  const formData = new FormData();

  const baseUploadDir = getBaseUploadDir();

  for (const element of data.value) {
    const { fullPath, file } = element;

    if (!fullPath || !file) {
      continue;
    }

    const isFileInDirectory = fullPath.split("/").length > 2;

    if (isFileInDirectory) {
      const splitPathWithoutFilename = fullPath.split("/").slice(0, -1);

      formData.append(
        `${baseUploadDir}/${splitPathWithoutFilename.join("/")}`,
        file
      );

      continue;
    }

    formData.append(baseUploadDir, file);
  }

  // @TMP
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
}
</script>
