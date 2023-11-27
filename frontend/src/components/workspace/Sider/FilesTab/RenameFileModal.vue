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

        <n-button type="warning" :loading="isLoading" @click="onSubmit">
          Confirm
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { object, string } from "yup";
import { NForm, NFormItem, NInput, NModal, NSpace, NButton } from "naive-ui";

import isFile from "@/helpers/isFile";
import { useFilesStore } from "@/store/files";
import { defineForm } from "@/helpers/defineForm";
import { useGeneralStore } from "@/store/general";
import { useWorkspacesStore } from "@/store/workspaces";

interface IProps {
  isVisible: boolean;

  fileId: number;
}

const filesStore = useFilesStore();
const generalStore = useGeneralStore();
const workspacesStore = useWorkspacesStore();

const props = defineProps<IProps>();

const emits = defineEmits(["update:is-visible"]);

const isLoading = ref(false);
const { fileId } = toRefs(props);

const treeItem = workspacesStore.tree.find(
  item => item.id === fileId.value && isFile(item)
);

const { fields, getError, hasError, handleSubmit, setValidationErrors } =
  defineForm(
    {
      filename: treeItem && isFile(treeItem) ? treeItem.originalFilename : "",
    },
    object({
      filename: string().required(),
    })
  );

const {
  filename: { value: filename },
} = fields;

function close() {
  emits("update:is-visible", false);
}

const onSubmit = handleSubmit.withControlled(async formData => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await filesStore.patchFilename(fileId.value, formData.filename);

    generalStore.messageProvider.success(`File renamed`);

    close();
  } catch (error) {
    console.error(error);

    setValidationErrors(error);

    generalStore.messageProvider.error(`File rename operation failed!`);
  } finally {
    isLoading.value = false;
  }
});
</script>
