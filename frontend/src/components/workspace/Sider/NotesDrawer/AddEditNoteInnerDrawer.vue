<template>
  <n-drawer
    :show="isVisible"
    resizable
    placement="bottom"
    :show-mask="false"
    :trap-focus="false"
    to="#notes-drawer-content"
  >
    <n-drawer-content
      :footer-style="{
        display: 'flex',
        margin: '0 10px',
        justifyContent: 'space-between',
      }"
    >
      <n-form :show-label="false" :style="{ paddingTop: '20px' }">
        <n-form-item
          :feedback="getError('text')"
          :validation-status="hasError('text')"
        >
          <n-input
            v-model:value="text"
            type="textarea"
            :autosize="{
              minRows: 8,
            }"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-button secondary :loading="isLoading" @click="$emit('cancel')">
          Cancel
        </n-button>

        <n-button
          type="info"
          secondary
          @click="onSubmit"
          :loading="isLoading"
          :disabled="isInitialValue"
        >
          Save
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  NForm,
  NInput,
  NButton,
  NDrawer,
  NFormItem,
  NDrawerContent,
} from "naive-ui";
import { ref, toRefs } from "vue";
import { object, string } from "yup";

import { defineForm } from "@/helpers/defineForm";
import { defineComputed } from "@/helpers/defineComputed";
import type { INoteDto } from "@shared/types/dtos/INoteDto";
import { defineWatchers } from "@/helpers/defineWatchers";

interface IProps {
  isVisible: boolean;

  noteToEdit: INoteDto | null;
}

const props = defineProps<IProps>();

defineEmits(["cancel"]);

const { isVisible, noteToEdit } = toRefs(props);

const defaultFormData: { text: string } = {
  text: "",
};

const { fields, getError, hasError, setFormData, handleSubmit, resetForm } =
  defineForm<{
    text: string;
  }>(
    defaultFormData,
    object({
      text: string().required(),
    })
  );

const isLoading = ref(false);

const {
  text: { value: text },
} = fields;

const { isInitialValue } = defineComputed({
  isInitialValue() {
    return (noteToEdit.value?.value || defaultFormData.text) === text.value;
  },
});

defineWatchers({
  isVisible: {
    source: isVisible,
    handler: () => {
      if (!isVisible.value) {
        setTimeout(() => {
          resetForm();
        }, 500);

        return;
      }

      if (noteToEdit.value) {
        setFormData({ text: noteToEdit.value.value });
      }
    },
  },

  noteToEdit: {
    source: noteToEdit,
    handler: () => {
      if (noteToEdit.value) {
        setFormData({ text: noteToEdit.value.value });
      }
    },
    options: {
      deep: true,
    },
  },
});

const onSubmit = handleSubmit.withControlled(async formData => {
  // emit("save", formData.text);
});
</script>
