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
    </template>

    <template #header-extra>
      <actions-dropdown v-if="isOwner" :message="value" />
    </template>

    <template #description>
      <n-tooltip trigger="hover" placement="right">
        <template #trigger>
          <n-text depth="3">
            <small>{{ dateService.fromNow(value.timestamps.createdAt) }}</small>
          </n-text>
        </template>

        {{ dateService.format(value.timestamps.createdAt, "YYYY-MM-DD HH:mm") }}
      </n-tooltip>
    </template>

    {{ value.value }}
  </n-thing>
</template>

<script setup lang="ts">
import { NText, NThing, NAvatar, NTooltip } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import ActionsDropdown from "./ActionsDropdown.vue";
import { defineComputed } from "@/helpers/defineComputed";
import { useDateService } from "@/services/useDateService";
import type { IChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

const authStore = useAuthStore();
const dateService = useDateService();

interface IProps {
  value: IChatMessageDTO;
}

const props = defineProps<IProps>();

const { initials, createdBy, isOwner } = defineComputed({
  initials() {
    const [name, surname] = props.value.author.fullName.split(" ");

    return `${name[0]}${surname[0]}`;
  },

  createdBy() {
    return props.value.author.fullName;
  },

  isOwner() {
    return authStore.loggedUserId === props.value.author.id;
  },
});
</script>
