<template>
  <n-modal
    :show="isVisible"
    segmented
    title="Rename file"
    preset="card"
    :bordered="true"
    :closable="!isLoading"
    :close-on-esc="false"
    :mask-closable="false"
    :style="{ width: '600px' }"
    @close="close"
  >
    <n-form>
      <n-form-item
        label="Name"
        :required="true"
        :feedback="getError('filename')"
        :validation-status="hasError('filename')"
      >
        <n-input v-model:value="filename" type="text" placeholder="Name" />
      </n-form-item>
    </n-form>

    <template #footer>
      <n-space justify="space-between">
        <n-button @click="close" :disabled="isLoading"> Cancel </n-button>

        <n-button
          type="warning"
          :loading="isLoading"
          :disabled="filename === initialFilename || !filename"
          @click="onSubmit"
        >
          Confirm
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { object, string } from "yup";
import { NForm, NFormItem, NInput, NModal, NSpace, NButton } from "naive-ui";

import isFile from "@/helpers/isFile";
import { useFilesStore } from "@/store/files";
import { FILE_RULES } from "@shared/constants/rules";
import { useWorkspacesStore } from "@/store/workspaces";
import type { Emits, Props } from "@/types/CommonModalTypes";
import { defineFormApiRequest } from "@/helpers/defineFormApiRequest";

const props = defineProps<Props & { fileId: number }>();
const emits = defineEmits<Emits>();

const filesStore = useFilesStore();
const workspacesStore = useWorkspacesStore();

const { fileId } = toRefs(props);

const treeItem = workspacesStore.tree.find(
  item => item.id === fileId.value && isFile(item)
);

function close() {
  emits("update:is-visible", false);
}

const initialFilename =
  treeItem && isFile(treeItem) ? treeItem.originalFilename : "";

const {
  vModel: { filename },
  isLoading,
  getError,
  hasError,
  onSubmit,
} = defineFormApiRequest({
  data: {
    filename: initialFilename,
  },

  schema: object({
    filename: string().required().matches(FILE_RULES.FILENAME.REGEX),
  }),

  formCallHandler: async (formData, printSuccess) => {
    await filesStore.patchFilename(fileId.value, formData.filename);

    printSuccess("File renamed.");

    close();
  },

  errorHandler: (error, printError) => {
    printError("File rename operation failed!");
  },
});
</script>
