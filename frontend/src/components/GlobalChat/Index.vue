<template>
  <!-- @TODO on logout should be closed -->
  <div class="global-chat">
    <loading-section v-if="chatMessagesStore.items.length === 0 && isLoading" />

    <!-- @TODO cover empty chat case -->

    <div class="wrapper" v-else>
      <n-scrollbar trigger="none">
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
import { Add as AddIcon } from "@vicons/carbon";
import { NScrollbar, NButton, NIcon } from "naive-ui";
import { reactive, ref, toRefs, watch, type Ref } from "vue";

import Thread from "./Thread.vue";
import { useGeneralStore } from "@/store/general";
import type { ChatMessage } from "@/types/ChatMessage";
import { useChatMessagesStore } from "@/store/chat-messages";
import LoadingSection from "@/components/common/LoadingSection.vue";

const generalStore = useGeneralStore();
const chatMessagesStore = useChatMessagesStore();

const { isChatVisible } = toRefs(generalStore);
const { NESTED_ITEMS_BY_DEPTH } = toRefs(chatMessagesStore);

const isLoading = ref(false);

const messageIdsToLoadRepliesTo: { value: number[] } = reactive({ value: [] });

async function fetchSourceMessages(page = 1, loader: Ref<boolean>) {
  if (loader.value) {
    return;
  }

  loader.value = true;

  try {
    await chatMessagesStore.getAll({
      page,
      perPage: chatMessagesStore.ITEMS_PER_PAGE,
    });
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error("Failed to fetch chat messages!");
  } finally {
    loader.value = false;

    const [scrollbarContainer] = document.getElementsByClassName(
      "n-scrollbar-container"
    );

    scrollbarContainer.scrollTo({
      left: 0,
      top: scrollbarContainer.scrollHeight,
      behavior: "instant",
    });
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

    generalStore.messageProvider.error("Failed to fetch chat replies!");
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

  fetchSourceMessages(1, isLoading);
});
</script>
