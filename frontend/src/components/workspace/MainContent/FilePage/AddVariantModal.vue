<template>
  <n-modal
    :show="isVisible"
    segmented
    title="New variant"
    preset="card"
    :bordered="true"
    :mask-closable="false"
    :style="{ width: '100vh' }"
    @close="$emit('update:is-visible', false)"
  >
    <n-form>
      <n-form-item
        label="Name"
        :required="true"
        :feedback="getError('name')"
        :validation-status="hasError('name')"
      >
        <n-input v-model:value="name" placeholder="name" />
      </n-form-item>

      <n-form-item
        label="File"
        :required="true"
        :feedback="getError('file')"
        :validation-status="hasError('file')"
      >
        <n-upload
          v-model:file-list="uploadedFiles"
          :disabled="isLoading"
          @before-upload="uploadedFiles = []"
          @update-file-list="onFileListUpdate"
        >
          <n-button>Select file</n-button>
        </n-upload>
      </n-form-item>
    </n-form>

    <template #footer>
      <n-button
        :loading="isLoading"
        :disabled="uploadedFiles.length === 0 || !name"
        @click="onSubmit"
      >
        Submit
      </n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NForm,
  NInput,
  NModal,
  NButton,
  NUpload,
  NFormItem,
  type UploadFileInfo,
} from "naive-ui";
import { ref, type Ref } from "vue";
import { mixed, object, string } from "yup";

import { useVariantsStore } from "@/store/variants";
import { VARIANT_RULES } from "@shared/constants/rules";
import { useModalHelpers } from "@/helpers/useModalHelpers";
import type { AddVariantForm } from "@/types/AddVariantForm";
import type { Emits, Props } from "@/types/CommonModalTypes";
import { defineFormApiRequest } from "@/helpers/defineFormApiRequest";

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const variantsStore = useVariantsStore();

const uploadedFiles: Ref<UploadFileInfo[]> = ref([]);

const { isVisible } = useModalHelpers(props, {
  onShow: () => {
    resetForm();

    uploadedFiles.value = [];

    setFormData({
      name: "",
      file: null,
    });
  },
});

const {
  vModel: { name },
  isLoading,
  getError,
  hasError,
  resetForm,
  setFormData,
  onSubmit,
} = defineFormApiRequest<AddVariantForm>({
  data: {
    name: "",
    file: null,
  },

  schema: object({
    name: string().trim().required().min(VARIANT_RULES.NAME.MIN_LENGTH),
    file: mixed<File>().required(),
  }),

  formCallHandler: async (value, printSuccess) => {
    const formData = new FormData();

    formData.append("name", value.name);
    formData.append("file", value.file || "");

    await variantsStore.add(formData);

    printSuccess(`Variant successfully added!`);

    emits("update:is-visible", false);
  },

  errorHandler: (error, printError) => {
    printError(`Failed to add variant!`);
  },
});

function onFileListUpdate(fileList: UploadFileInfo[]) {
  if (fileList.length === 0) {
    return;
  }

  const [element] = fileList;

  setFormData({ name: name.value, file: element.file });
}
</script>
