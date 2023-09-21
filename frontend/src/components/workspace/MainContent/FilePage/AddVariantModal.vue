<template>
  <n-modal
    :show="isVisible"
    segmented
    title="New variant"
    preset="card"
    :bordered="true"
    :mask-closable="false"
    :style="{ width: '100vh' }"
    @close="onClose"
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
          <n-button>Upload file</n-button>
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
  useMessage,
  type UploadFileInfo,
} from "naive-ui";
import cloneDeep from "lodash/cloneDeep";
import { ref, toRefs, type Ref } from "vue";
import { mixed, object, string } from "yup";

import { defineForm } from "@/helpers/defineForm";
import { useVariantsStore } from "@/store/variants";
import { defineWatchers } from "@/helpers/defineWatchers";
import type { AddVariantForm } from "@/types/AddVariantForm";

const message = useMessage();
const variantsStore = useVariantsStore();

const isLoading = ref(false);
const data: Ref<UploadFileInfo[]> = ref([]);
const defaultFormData: AddVariantForm = {
  name: "",
  file: null,
};

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:is-visible"]);

const { isVisible } = toRefs(props);

defineWatchers({
  isVisible: {
    source: isVisible,
    handler(value: boolean) {
      if (!value) {
        return;
      }

      resetForm();

      setFormData(cloneDeep(defaultFormData));
    },
  },
});

const { fields, getError, hasError, resetForm, setFormData, handleSubmit } =
  defineForm<AddVariantForm>(
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

    message.success(`Variant successfully added!`);

    onClose();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});

function onClose() {
  data.value = [];

  emit("update:is-visible", false);
}

function onFileListUpdate(fileList: UploadFileInfo[]) {
  if (fileList.length === 0) {
    return;
  }

  const [element] = fileList;

  setFormData({ name: name.value, file: element.file });
}
</script>
