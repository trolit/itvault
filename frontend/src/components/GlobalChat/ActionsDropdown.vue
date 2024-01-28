<template>
  <n-dropdown
    size="small"
    trigger="click"
    :options="options"
    placement="bottom-end"
    @select="handleSelect"
  >
    <n-button text>
      <n-icon :size="20" :component="GearIcon" />
    </n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import { h } from "vue";
import { OperationsField as GearIcon } from "@vicons/carbon";
import { NIcon, NText, NButton, NDropdown, useDialog } from "naive-ui";

import { defineComputed } from "@/helpers/defineComputed";
import type { IChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

const dialog = useDialog();

interface IProps {
  message: IChatMessageDTO;
}

defineProps<IProps>();

const emits = defineEmits(["update-message"]);

const { options } = defineComputed({
  options() {
    return [
      {
        label: "Update",
        key: "update",
      },
      {
        key: "delete",
        label: () => h(NText, { type: "error" }, { default: () => "Delete" }),
      },
    ];
  },
});

function handleSelect(key: string) {
  if (key === "update") {
    emits("update-message");

    return;
  }

  if (key === "delete") {
    const deleteDialog = dialog.warning({
      title: "Confirm",
      content: "Are you sure?",
      positiveText: "Delete",
      negativeText: "Close",
      onPositiveClick: async () => {
        deleteDialog.loading = true;

        // @TODO
      },
    });

    return;
  }
}
</script>
