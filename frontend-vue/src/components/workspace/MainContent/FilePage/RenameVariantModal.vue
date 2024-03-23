<template>
  <n-modal
    :show="isVisible"
    segmented
    title="Rename variant"
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
        :feedback="getError('name')"
        :validation-status="hasError('name')"
      >
        <n-input v-model:value="name" type="text" placeholder="Name" />
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
import { object, string } from "yup";
import { NForm, NFormItem, NInput, NModal, NSpace, NButton } from "naive-ui";

import { useFilesStore } from "@/store/files";
import { useVariantsStore } from "@/store/variants";
import { useModalHelpers } from "@/helpers/useModalHelpers";
import type { Emits, Props } from "@/types/CommonModalTypes";
import { defineFormApiRequest } from "@/helpers/defineFormApiRequest";

const props = defineProps<Props & { variantId: string }>();
const emits = defineEmits<Emits>();

const filesStore = useFilesStore();
const variantsStore = useVariantsStore();

const { isVisible } = useModalHelpers(props, {
  onShow: () => {
    const tab = filesStore.activeTab
      ? filesStore.activeTab.variantTabs.find(
          tab => tab.variant.id === props.variantId
        )
      : undefined;

    if (tab) {
      name.value = tab.variant.name;
    }
  },
});

const {
  isLoading,
  vModel: { name },
  getError,
  hasError,
  onSubmit,
} = defineFormApiRequest<{ name: string }>({
  data: {
    name: "",
  },

  schema: object({
    name: string().trim().required(),
  }),

  formCallHandler: async (formData, printSuccess) => {
    await variantsStore.patchName(props.variantId, formData.name);

    printSuccess(`Variant renamed!`);

    close();
  },

  errorHandler: (error, printError) => {
    printError(`Variant rename operation failed!`);
  },
});

function close() {
  emits("update:is-visible", false);
}
</script>
