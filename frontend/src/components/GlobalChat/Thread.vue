<template>
  <div class="thread">
    <!-- @TODO consider button to open thread in separate section -->

    <div>
      <message
        :item="item"
        :is-expanded="isExpanded"
        :is-loading="
          wereAnyRepliesFetched ? false : messageIdsUnderLoad.includes(item.id)
        "
        @load-replies="
          wereAnyRepliesFetched
            ? (isExpanded = !isExpanded)
            : $emit('load-replies', item, 1)
        "
        @reply="$emit('reply', $event)"
        @update="$emit('update', $event)"
      />
    </div>

    <div
      v-if="item.replies.length"
      class="replies"
      :style="{
        marginLeft: `${item.depth * 15}px`,
      }"
    >
      <n-collapse-transition :show="isExpanded">
        <div
          v-for="reply in item.replies"
          :key="`reply-${reply.id}-to-${item.id}`"
        >
          <thread
            :item="reply"
            :message-ids-under-load="messageIdsUnderLoad"
            @load-replies="
              $emit('load-replies', reply, reply.replies.length ? nextPage : 1)
            "
            @reply="$emit('reply', $event)"
            @update="$emit('update', $event)"
          />

          <div
            class="load-more-replies-wrapper"
            v-if="reply.id === lastReplyId && !areAllRepliesLoaded"
            :style="{ left: `-${loadMoreRepliesIconSize - 2}px` }"
          >
            <n-button
              size="tiny"
              :loading="messageIdsUnderLoad.includes(item.id)"
              @click="$emit('load-replies', item, nextPage)"
            >
              <n-icon
                :component="LoadMoreIcon"
                :size="loadMoreRepliesIconSize"
              />
            </n-button>
          </div>
        </div>
      </n-collapse-transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Term as LoadMoreIcon } from "@vicons/carbon";
import { NCollapseTransition, NButton, NIcon } from "naive-ui";

import Message from "./Message.vue";
import type { ChatMessage } from "@/types/ChatMessage";
import { useChatMessagesStore } from "@/store/chat-messages";
import type { IChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

const chatMessagesStore = useChatMessagesStore();

interface IProps {
  item: ChatMessage;

  messageIdsUnderLoad: number[];
}

const isExpanded = ref(true);

const loadMoreRepliesIconSize = 18;
const props = defineProps<IProps>();

defineEmits<{
  (event: "reply", message: IChatMessageDTO): void;

  (event: "update", message: IChatMessageDTO): void;

  (event: "load-replies", item: ChatMessage, page: number): void;
}>();

const wereAnyRepliesFetched = computed(() => !!props.item.replies.length);

const lastReplyId = computed(() => {
  return props.item.replies.length
    ? props.item.replies[props.item.replies.length - 1].id
    : 0;
});

const nextPage = computed(() => {
  return Math.ceil(
    (props.item.replies.length + chatMessagesStore.ITEMS_PER_PAGE) /
      chatMessagesStore.ITEMS_PER_PAGE
  );
});

const areAllRepliesLoaded = computed(() => {
  return props.item.replies.length === props.item.repliesCount;
});
</script>
