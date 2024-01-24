<template>
  <div class="global-chat">
    <loading-section v-if="chatMessagesStore.items.length === 0 && isLoading" />

    <div class="wrapper" v-else>
      <n-scrollbar>
        <thread
          v-for="(item, index) in NESTED_ITEMS_BY_DEPTH"
          :key="index"
          :item="item"
          :message-ids-under-load="messageIdsToLoadRepliesTo.value"
          @load-replies="onRepliesLoad"
        />
      </n-scrollbar>

      <div class="footer">
        <n-button :disabled="isLoading" size="small" ghost>
          <n-icon :component="AddIcon" :size="25" />
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, watch } from "vue";
import { Add as AddIcon } from "@vicons/carbon";
import { NScrollbar, NButton, NIcon } from "naive-ui";

import Thread from "./Thread.vue";
import { useGeneralStore } from "@/store/general";
import { useChatMessagesStore } from "@/store/chat-messages";
import LoadingSection from "@/components/common/LoadingSection.vue";
import type { ChatMessage } from "@/types/ChatMessage";

const generalStore = useGeneralStore();
const chatMessagesStore = useChatMessagesStore();

const { isChatVisible } = toRefs(generalStore);
const { NESTED_ITEMS_BY_DEPTH } = toRefs(chatMessagesStore);

const isLoading = ref(false);

const messageIdsToLoadRepliesTo: { value: number[] } = reactive({ value: [] });

async function onLoad() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await chatMessagesStore.getAll({
      page: 1,
      perPage: chatMessagesStore.ITEMS_PER_PAGE,
    });
  } catch (error) {
    console.log(error);

    // @TODO
  } finally {
    isLoading.value = false;
  }
}

async function onRepliesLoad(message: ChatMessage, page: number) {
  if (messageIdsToLoadRepliesTo.value.includes(message.id)) {
    return;
  }

  messageIdsToLoadRepliesTo.value.push(message.id);

  try {
    await chatMessagesStore.getAll({
      page,
      perPage: chatMessagesStore.ITEMS_PER_PAGE,
      messageId: message.id,
    });
  } catch (error) {
    console.log(error);

    // @TODO
  } finally {
    const idIndex = messageIdsToLoadRepliesTo.value.findIndex(
      id => id === message.id
    );

    if (~idIndex) {
      messageIdsToLoadRepliesTo.value.splice(idIndex, 1);
    }
  }
}

watch(isChatVisible, async () => {
  if (!isChatVisible.value || chatMessagesStore.items.length) {
    return;
  }

  onLoad();
});
</script>
