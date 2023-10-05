<template>
  <div>
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

    <n-space justify="space-between">
      <n-button secondary @click="$emit('cancel')" :loading="isLoading">
        Cancel
      </n-button>

      <n-button
        type="info"
        secondary
        :loading="isLoading"
        :disabled="isInitialValue"
        @click="onSubmit"
      >
        Save
      </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { object, string } from "yup";
import { NForm, NFormItem, NInput, NSpace, NButton } from "naive-ui";

import { defineForm } from "@/helpers/defineForm";
import { defineComputed } from "@/helpers/defineComputed";

interface IProps {
  isLoading: boolean;

  value: string;
}

const props = defineProps<IProps>();

const emit = defineEmits(["cancel", "save"]);

const { isLoading, value: originalText } = toRefs(props);

const defaultFormData: { text: string } = {
  text: "",
};

const { fields, getError, hasError, setFormData, handleSubmit } = defineForm<{
  text: string;
}>(
  defaultFormData,
  object({
    text: string().required(),
  })
);

setFormData({ text: originalText.value });

const {
  text: { value: text },
} = fields;

const onSubmit = handleSubmit.withControlled(async formData => {
  emit("save", formData.text);
});

const { isInitialValue } = defineComputed({
  isInitialValue() {
    return originalText.value === text.value;
  },
});
</script>
