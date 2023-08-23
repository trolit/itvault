<template>
  <div class="form-step">
    <n-form>
      <n-form-item label="Note">
        <n-input
          :autosize="{
            minRows: 5,
          }"
          :value="formData.note"
          type="textarea"
          placeholder="Bundle note"
          @update:value="updateText"
        />
      </n-form-item>

      <n-form-item label="Expiration">
        <n-select
          :value="formData.expiration"
          :options="options"
          @update-value="updateExpiration"
        />
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { NInput, NSelect, NForm, NFormItem } from "naive-ui";

import { BundleExpire } from "@shared/types/enums/BundleExpire";
import type { AddBundleDto } from "@shared/types/dtos/AddBundleDto";

const props = defineProps({
  formData: {
    type: Object as PropType<AddBundleDto>,
    required: true,
  },
});

const emit = defineEmits(["update:form-data"]);

const options = [
  {
    label: "1 day",
    value: BundleExpire.OneDay,
  },

  {
    label: "Never",
    value: BundleExpire.Never,
  },
];

function updateText(note: string) {
  emit("update:form-data", { ...props.formData, note });
}

function updateExpiration(expiration: string) {
  emit("update:form-data", { ...props.formData, expiration });
}
</script>
