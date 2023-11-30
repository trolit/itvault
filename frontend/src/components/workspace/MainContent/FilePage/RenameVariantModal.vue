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
import { ref, toRefs } from "vue";
import { object, string } from "yup";
import { NForm, NFormItem, NInput, NModal, NSpace, NButton } from "naive-ui";

import { useFilesStore } from "@/store/files";
import { defineForm } from "@/helpers/defineForm";
import { useGeneralStore } from "@/store/general";
import { useVariantsStore } from "@/store/variants";
import { defineWatchers } from "@/helpers/defineWatchers";

interface IProps {
  isVisible: boolean;

  variantId: string;
}

const filesStore = useFilesStore();
const generalStore = useGeneralStore();
const variantsStore = useVariantsStore();

const props = defineProps<IProps>();

const { isVisible } = toRefs(props);

const emits = defineEmits(["update:is-visible"]);

const isLoading = ref(false);

const { fields, getError, hasError, handleSubmit, setValidationErrors } =
  defineForm(
    {
      name: "",
    },
    object({
      name: string().required(),
    })
  );

const {
  name: { value: name },
} = fields;

defineWatchers({
  isVisible: {
    source: isVisible,
    handler: (value: boolean) => {
      if (!value) {
        return;
      }

      const tab = filesStore.activeTab
        ? filesStore.activeTab.variantTabs.find(
            tab => tab.variant.id === props.variantId
          )
        : undefined;

      if (tab) {
        name.value = tab.variant.name;
      }
    },
  },
});

function close() {
  emits("update:is-visible", false);
}

const onSubmit = handleSubmit.withControlled(async formData => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await variantsStore.patchName(props.variantId, formData.name);

    generalStore.messageProvider.success(`Variant renamed!`);

    close();
  } catch (error) {
    console.error(error);

    setValidationErrors(error);

    generalStore.messageProvider.error(`Variant rename operation failed!`);
  } finally {
    isLoading.value = false;
  }
});
</script>
