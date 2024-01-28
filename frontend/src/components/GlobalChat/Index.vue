<template>
  <!-- @TODO on logout should be closed -->
  <div class="global-chat">
    <loading-section v-if="isLoadingSection" />

    <!-- @TODO cover empty chat case -->
    <div ref="wrapper" class="wrapper" v-else>
      <n-scrollbar ref="scrollbar" trigger="none">
        <thread
          v-for="(item, index) in NESTED_ITEMS_BY_DEPTH"
          :key="index"
          :item="item"
          :message-ids-under-load="messageIdsToLoadRepliesTo.value"
          @load-replies="onRepliesLoad"
          @update-message="$emit('update-message', $event)"
          @reply-to-message="$emit('reply-to-message', $event)"
        />

        <div ref="fetchpoint" class="fetchpoint">
          <n-spin v-if="isLoadingMoreSourceMessages" />

          <small v-if="areAllMessagesLoaded">
            <n-text :depth="3"> -- Nothing more to load -- </n-text>
          </small>
        </div>
      </n-scrollbar>

      <div class="footer">
        <n-button :disabled="isLoadingSection" size="small" ghost>
          <n-icon
            :size="25"
            :component="AddIcon"
            @click="$emit('add-message')"
          />
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Add as AddIcon } from "@vicons/carbon";
import { reactive, ref, toRefs, watch, type Ref } from "vue";
import { NScrollbar, NButton, NIcon, NSpin, NText } from "naive-ui";

import Thread from "./Thread.vue";
import { useGeneralStore } from "@/store/general";
import type { ChatMessage } from "@/types/ChatMessage";
import { useChatMessagesStore } from "@/store/chat-messages";
import LoadingSection from "@/components/common/LoadingSection.vue";
import type { IChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

defineEmits<{
  (event: "add-message"): void;

  (event: "update-message", item: IChatMessageDTO): void;

  (event: "reply-to-message", item: IChatMessageDTO): void;
}>();

const generalStore = useGeneralStore();
const chatMessagesStore = useChatMessagesStore();

const { isChatVisible } = toRefs(generalStore);
const { NESTED_ITEMS_BY_DEPTH } = toRefs(chatMessagesStore);

const wrapper = ref(null);
const fetchpoint = ref(null);
const scrollbar: Ref<Element | null> = ref(null);

const isLoadingSection = ref(false);
const isLoadingMoreSourceMessages = ref(false);
const sourceMessagesPage = ref(1);
const areAllMessagesLoaded = ref(false);

const messageIdsToLoadRepliesTo: { value: number[] } = reactive({ value: [] });

async function fetchSourceMessages(loader: Ref<boolean>) {
  if (loader.value) {
    return;
  }

  loader.value = true;

  try {
    await chatMessagesStore.getAll({
      page: sourceMessagesPage.value,
      perPage: chatMessagesStore.ITEMS_PER_PAGE,
    });

    sourceMessagesPage.value++;
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error("Failed to fetch chat messages!");
  } finally {
    loader.value = false;
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

  await fetchSourceMessages(isLoadingSection);

  scrollToTheBottom();

  addScrollObserver();
});

function addScrollObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(async entry => {
      if (entry.isIntersecting) {
        await fetchSourceMessages(isLoadingMoreSourceMessages);

        if (chatMessagesStore.items.length === chatMessagesStore.total) {
          observer.disconnect();

          areAllMessagesLoaded.value = true;
        }
      }
    });
  });

  if (fetchpoint.value) {
    observer.observe(fetchpoint.value);
  }
}

function scrollToTheBottom() {
  const scrollbars = document.getElementsByClassName("n-scrollbar-container");

  if (scrollbar.value && scrollbars.length) {
    scrollbar.value.scrollTo({
      left: 0,
      top: scrollbars[0].scrollHeight,
      behavior: "instant",
    });
  }
}
</script>
