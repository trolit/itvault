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
      <n-tabs default-value="edit" type="line">
        <n-tab-pane name="edit" tab="Edit">
          <!-- @TODO menu that allows to input markdown syntax at carriage position -->
          <n-form :show-label="false">
            <n-form-item
              :feedback="getError('text')"
              :validation-status="hasError('text')"
            >
              <n-input
                v-model:value="text"
                show-count
                passively-activated
                :maxlength="CHAT_MESSAGE_RULES.VALUE.MAX_LENGTH"
                type="textarea"
                placeholder="👉 type your message 👈"
                :autosize="{
                  minRows: 4,
                }"
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="preview" tab="Preview">
          <div class="preview">
            <span v-if="!text">Nothing to preview</span>

            <div
              v-else
              v-html="markdown.render(text)"
              class="markdown-render-area"
            />
          </div>
        </n-tab-pane>

        <template #suffix>
          <n-button disabled quaternary circle>
            <n-icon :component="MenuVerticalIcon" :size="24" />
          </n-button>
        </template>
      </n-tabs>

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
  NTabs,
  NIcon,
  NInput,
  NButton,
  NDrawer,
  NTabPane,
  NFormItem,
  NDrawerContent,
} from "naive-ui";
import { toRefs, watch } from "vue";
import { object, string } from "yup";
import { OverflowMenuVertical as MenuVerticalIcon } from "@vicons/carbon";

import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";
import { CHAT_MESSAGE_RULES } from "@shared/constants/rules";
import { useChatMessagesStore } from "@/store/chat-messages";
import { useMarkdownService } from "@/services/useMarkdownService";
import { defineFormApiRequest } from "@/helpers/defineFormApiRequest";
import type { IChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

interface IProps {
  isVisible: boolean;

  item: IChatMessageDTO | null;

  action: "update" | "add" | "reply";
}

const props = defineProps<IProps>();
const { isVisible, action, item } = toRefs(props);

const emits = defineEmits(["close"]);

const markdown = useMarkdownService();
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
        }, 250);
      }
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

watch(
  [action, item],
  () => {
    if (props.action === "update" && props.item) {
      setFormData({ text: props.item.value });

      return;
    }

    resetForm();
  },
  { deep: true }
);
</script>
