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
          v-model:file-list="data"
          :disabled="isLoading"
          @before-upload="data = []"
          @update-file-list="onFileListUpdate"
        >
          <n-button>Select file</n-button>
        </n-upload>
      </n-form-item>
    </n-form>

    <template #footer>
      <n-button
        :loading="isLoading"
        :disabled="data.length === 0 || !name"
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
import cloneDeep from "lodash/cloneDeep";
import { mixed, object, string } from "yup";

import { defineForm } from "@/helpers/defineForm";
import { useGeneralStore } from "@/store/general";
import { useVariantsStore } from "@/store/variants";
import { useModalHelpers } from "@/helpers/useModalHelpers";
import type { AddVariantForm } from "@/types/AddVariantForm";

interface IProps {
  isVisible: boolean;
}

interface IEmits {
  (event: "update:is-visible", state: boolean): void;
}

const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();

const generalStore = useGeneralStore();
const variantsStore = useVariantsStore();

const isLoading = ref(false);
const data: Ref<UploadFileInfo[]> = ref([]);
const defaultFormData: AddVariantForm = {
  name: "",
  file: null,
};

const { isVisible } = useModalHelpers(props, {
  onShow: () => {
    resetForm();

    data.value = [];

    setFormData(cloneDeep(defaultFormData));
  },
});

const {
  fields,
  getError,
  hasError,
  resetForm,
  setFormData,
  handleSubmit,
  setValidationErrors,
} = defineForm<AddVariantForm>(
  defaultFormData,
  object({
    name: string().required(),
    file: mixed<File>().required(),
  })
);

const {
  name: { value: name },
} = fields;

const onSubmit = handleSubmit.withControlled(async value => {
  if (isLoading.value || !value.file) {
    return;
  }

  isLoading.value = true;

  const formData = new FormData();

  formData.append("name", value.name);
  formData.append("file", value.file);

  try {
    await variantsStore.store(formData);

    generalStore.messageProvider.success(`Variant successfully added!`);

    emits("update:is-visible", false);
  } catch (error) {
    console.error(error);

    setValidationErrors(error);
  } finally {
    isLoading.value = false;
  }
});

function onFileListUpdate(fileList: UploadFileInfo[]) {
  if (fileList.length === 0) {
    return;
  }

  const [element] = fileList;

  setFormData({ name: name.value, file: element.file });
}
</script>
