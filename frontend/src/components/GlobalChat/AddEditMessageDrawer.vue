<template>
  <n-drawer
    :show="isVisible"
    resizable
    :min-width="400"
    :default-width="400"
    :show-mask="false"
    placement="left"
    :trap-focus="false"
    to="#main-layout-content"
    class="add-edit-message-drawer"
  >
    <n-drawer-content>
      <!-- @TODO menu that allows to input markdown syntax at carriage position -->
      <n-form :show-label="false">
        <n-form-item
          :feedback="getError('text')"
          :validation-status="hasError('text')"
        >
          <n-input
            v-model:value="text"
            show-count
            :maxlength="CHAT_MESSAGE_RULES.VALUE.MAX_LENGTH"
            type="textarea"
            placeholder="👉 type your message 👈"
            :autosize="{
              minRows: 8,
            }"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-button secondary :loading="isLoading" @click="$emit('close')">
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
import { toRefs } from "vue";
import { object, string } from "yup";

import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";
import { CHAT_MESSAGE_RULES } from "@shared/constants/rules";
import { useChatMessagesStore } from "@/store/chat-messages";
import { defineFormApiRequest } from "@/helpers/defineFormApiRequest";
import type { IChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

interface IProps {
  isVisible: boolean;

  item: IChatMessageDTO | null;

  action: "update" | "add" | "reply";
}

const props = defineProps<IProps>();
const { isVisible, action } = toRefs(props);

const emits = defineEmits(["close"]);

const chatMessagesStore = useChatMessagesStore();

const defaultFormData: { text: string } = {
  text: "",
};

const {
  vModel: { text },
  isLoading,
  getError,
  hasError,
  resetForm,
  setFormData,
  onSubmit,
} = defineFormApiRequest<{
  text: string;
}>({
  data: {
    text: "",
  },

  schema: object({
    text: string().required(),
  }),

  formCallHandler: async formData => {
    const { action } = props;

    if (action === "update" && props.item) {
      await chatMessagesStore.update(props.item.id, {
        text: formData.text,
      });
    } else if (action === "reply" && props.item) {
      await chatMessagesStore.add({
        replyToId: props.item.id,
        text: formData.text,
      });
    } else if (action === "add") {
      await chatMessagesStore.add({
        text: formData.text,
      });
    }

    emits("close");
  },

  errorHandler: (error, printError) => {
    printError(`Failed to save comment!`);
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
    },
  },

  action: {
    source: action,
    handler: () => {
      if (props.action === "update" && props.item) {
        setFormData({ text: props.item.value });

        return;
      }

      resetForm();
    },
  },
});

const { isInitialValue } = defineComputed({
  isInitialValue() {
    return props.action === "update"
      ? props.item?.value === text.value
      : defaultFormData.text === text.value;
  },
});
</script>
