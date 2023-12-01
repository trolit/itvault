<template>
  <n-modal
    segmented
    title="Upload files"
    preset="card"
    :bordered="true"
    :mask-closable="false"
    :style="{ width: '45vw' }"
  >
    <n-upload multiple directory-dnd v-model:file-list="data" :max="30">
      <n-upload-dragger>
        <n-space vertical>
          <n-icon size="68" :depth="3" :component="UploadIcon" />

          <n-text> (click) or (drag) to add files to upload </n-text>

          <n-p depth="3">
            <small>
              Drag directory to maintain files structure inside that directory
            </small>
          </n-p>

          <n-p v-if="DIRS_TO_IGNORE_FROM_UPLOAD.length" depth="3">
            <small> Ignored dirs </small>

            <div>
              <n-tag
                size="tiny"
                v-for="(item, index) in DIRS_TO_IGNORE_FROM_UPLOAD"
                :key="index"
              >
                {{ item }}
              </n-tag>
            </div>
          </n-p>
        </n-space>
      </n-upload-dragger>
    </n-upload>

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
      <n-auto-complete
        v-model:value="customPathValue"
        :options="autocompleteDirs"
        placeholder="custom path"
      />

      <small
        v-if="!isCustomPathEmpty && !isCustomPathValid"
        :style="{ color: '#FFCF40' }"
      >
        Provided path is invalid!
      </small>
    </div>

    <template #footer>
      <n-button
        :loading="isLoading"
        :disabled="
          data.length === 0 ||
          (!isRootDirectorySelected &&
            (!isCustomPathValid || isCustomPathEmpty))
        "
        @click="upload"
      >
        Upload 🚀
      </n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NP,
  NTag,
  NIcon,
  NText,
  NSpace,
  NModal,
  NRadio,
  NButton,
  NUpload,
  NRadioGroup,
  NAutoComplete,
  NUploadDragger,
  type UploadFileInfo,
} from "naive-ui";
import { ref, type Ref } from "vue";
import { useFilesStore } from "@/store/files";
import { Add as UploadIcon } from "@vicons/carbon";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineComputed } from "@/helpers/defineComputed";
import { DIRS_TO_IGNORE_FROM_UPLOAD } from "@shared/constants/config";

const filesStore = useFilesStore();
const workspacesStore = useWorkspacesStore();

const isLoading = ref(false);
const customPathValue = ref("");
const fileUploadDir = ref(filesStore.ROOT);
const data: Ref<UploadFileInfo[]> = ref([]);

const emit = defineEmits(["on-upload"]);

const customPathValueRegex = new RegExp(/^\.(\/[.a-z0-9-]+)*$/);

const {
  isRootDirectorySelected,
  isCustomPathEmpty,
  isCustomPathValid,
  autocompleteDirs,
} = defineComputed({
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

  autocompleteDirs() {
    return workspacesStore.ALL_DIRS.map(dir => dir.relativePath);
  },
});

function getBaseUploadDir() {
  return isRootDirectorySelected.value
    ? filesStore.ROOT
    : customPathValue.value;
}

// @NOTE e.g. (file) -> "fullPath": "/aha.txt" (file from dir) -> "fullPath": "/aha/zxde.txt"
async function upload() {
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
      const filePath = fullPath.split("/").slice(1, -1).join("/");

      formData.append(`${baseUploadDir}/${filePath}`, file);

      continue;
    }

    formData.append(baseUploadDir, file);
  }

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
