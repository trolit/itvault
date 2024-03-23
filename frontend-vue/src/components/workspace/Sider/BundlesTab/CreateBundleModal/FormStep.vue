<template>
  <div class="form-step">
    <n-form>
      <n-form-item label="Note">
        <n-input
          :autosize="{
            minRows: 5,
          }"
          :value="note"
          type="textarea"
          placeholder="Bundle note"
          @update:value="$emit('update:note', $event)"
        />
      </n-form-item>

      <n-form-item label="Expiration">
        <n-select
          :value="expiration"
          :options="options"
          @update-value="$emit('update:expiration', $event)"
        />
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { NInput, NSelect, NForm, NFormItem } from "naive-ui";

import { BundleExpire } from "@shared/types/enums/BundleExpire";

defineProps({
  note: {
    type: String,
    required: true,
  },

  expiration: {
    type: String as PropType<BundleExpire>,
    required: true,
  },
});

defineEmits(["update:note", "update:expiration"]);

const options = [
  {
    label: "1 day",
    value: BundleExpire.OneDay,
  },

  {
    label: "2 days",
    value: BundleExpire.TwoDays,
  },

  {
    label: "3 days",
    value: BundleExpire.ThreeDays,
  },

  {
    label: "1 week",
    value: BundleExpire.OneWeek,
  },

  {
    label: "2 weeks",
    value: BundleExpire.TwoWeeks,
  },

  {
    label: "1 month",
    value: BundleExpire.OneMonth,
  },

  {
    label: "Never",
    value: BundleExpire.Never,
  },
];
</script>
