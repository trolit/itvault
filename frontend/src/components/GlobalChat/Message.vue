<template>
  <n-thing class="message">
    <template #avatar>
      <n-avatar size="small"> {{ initials }} </n-avatar>
    </template>

    <template #header>
      <span
        :style="{
          color: isOwner ? 'gold' : undefined,
        }"
      >
        {{ createdBy }}
      </span>

      <div>
        <small>
          <n-tooltip trigger="hover" placement="right">
            <template #trigger>
              <n-text depth="3">
                <small>{{
                  dateService.fromNow(item.timestamps.createdAt)
                }}</small>
              </n-text>
            </template>

            {{
              dateService.format(item.timestamps.createdAt, "YYYY-MM-DD HH:mm")
            }}
          </n-tooltip>
        </small>
      </div>
    </template>

    <template #header-extra>
      <actions-dropdown v-if="isOwner" :message="item" />
    </template>

    <!-- @TODO markdown -->
    {{ item.value }}

    <template #action>
      <n-space
        v-if="item.depth < WORKSPACE_CHAT_MAX_DEPTH"
        justify="space-between"
        align="center"
      >
        <n-button
          v-if="hasAnyReply"
          text
          size="small"
          :loading="isLoading"
          @click="$emit('load-replies')"
        >
          <n-text :depth="3"> {{ repliesText }} {{ expandText }} </n-text>
        </n-button>

        <n-text v-else :depth="3">
          {{ repliesText }}
        </n-text>

        <n-button secondary size="tiny"> reply </n-button>
      </n-space>
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import { NText, NThing, NAvatar, NTooltip, NSpace, NButton } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import ActionsDropdown from "./ActionsDropdown.vue";
import type { ChatMessage } from "@/types/ChatMessage";
import { defineComputed } from "@/helpers/defineComputed";
import { useDateService } from "@/services/useDateService";
import { WORKSPACE_CHAT_MAX_DEPTH } from "@shared/constants/config";

const authStore = useAuthStore();
const dateService = useDateService();

interface IProps {
  item: ChatMessage;

  isLoading: boolean;

  isExpanded: boolean;
}

const props = defineProps<IProps>();

defineEmits(["load-replies"]);

const { expandText, initials, hasAnyReply, repliesText, createdBy, isOwner } =
  defineComputed({
    expandText() {
      return props.item.replies.length >= 1
        ? `(${props.isExpanded ? "-" : "+"})`
        : "";
    },

    repliesText() {
      return `${props.item.repliesCount} ${
        props.item.repliesCount === 1 ? "reply" : "replies"
      }`;
    },

    initials() {
      const [name, surname] = props.item.author.fullName.split(" ");

      return `${name[0]}${surname[0]}`;
    },

    hasAnyReply() {
      return props.item.repliesCount > 0;
    },

    createdBy() {
      return props.item.author.fullName;
    },

    isOwner() {
      return authStore.loggedUserId === props.item.author.id;
    },
  });
</script>
