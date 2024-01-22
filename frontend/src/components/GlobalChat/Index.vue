<template>
  <div class="global-chat">
    <loading-section v-if="chatMessagesStore.items.length === 0 && isLoading" />

    <div class="wrapper" v-else>
      <n-scrollbar>
        <message
          v-for="(item, index) in chatMessagesStore.items"
          :key="index"
          :item="item"
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
import { ref, toRefs, watch } from "vue";
import { Add as AddIcon } from "@vicons/carbon";
import { NScrollbar, NButton, NIcon } from "naive-ui";

import Message from "./Message.vue";
import { useGeneralStore } from "@/store/general";
import { useChatMessagesStore } from "@/store/chat-messages";
import LoadingSection from "@/components/common/LoadingSection.vue";

const generalStore = useGeneralStore();
const chatMessagesStore = useChatMessagesStore();
const { isChatVisible } = toRefs(generalStore);

const isLoading = ref(false);

async function getMessages(page: number, messageId?: number) {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await chatMessagesStore.getAll({
      page,
      perPage: chatMessagesStore.ITEMS_PER_PAGE,
      messageId,
    });
  } catch (error) {
    console.log(error);

    // @TODO
  } finally {
    isLoading.value = false;
  }
}

watch(isChatVisible, () => {
  if (!isChatVisible.value || chatMessagesStore.items.length) {
    return;
  }

  getMessages(1);
});
</script>
