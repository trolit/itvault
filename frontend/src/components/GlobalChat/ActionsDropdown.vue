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

import { useGeneralStore } from "@/store/general";
import type { ChatMessage } from "@/types/ChatMessage";
import { defineComputed } from "@/helpers/defineComputed";
import { useChatMessagesStore } from "@/store/chat-messages";

const dialog = useDialog();
const generalStore = useGeneralStore();
const chatMessagesStore = useChatMessagesStore();

interface IProps {
  item: ChatMessage;
}

const props = defineProps<IProps>();

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
        show: props.item.repliesCount === 0,
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

        try {
          await chatMessagesStore.delete(props.item.id);

          generalStore.messageProvider.error("Message removed!");
        } catch (error) {
          console.log(error);

          generalStore.messageProvider.error("Failed to remove message!");
        } finally {
          deleteDialog.loading = false;
        }
      },
    });

    return;
  }
}
</script>
