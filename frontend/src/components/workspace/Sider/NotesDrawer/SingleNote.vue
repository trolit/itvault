<template>
  <!-- @TODO show some indicator if message is removed or not (display only if permission is enabled)-->
  <n-thing class="single-note">
    <template #avatar>
      <n-avatar size="small"> {{ initials }} </n-avatar>
    </template>

    <template #header>
      <span>
        {{ createdBy.fullName }}
      </span>

      <br />

      <n-tag size="small">
        {{ createdBy.role }}
      </n-tag>
    </template>

    <template #header-extra>
      <actions-dropdown
        v-if="
          isNoteOwner ||
          canViewUserNotes ||
          canDeleteAnyNote ||
          canUpdateAnyNote
        "
        :is-note-owner="isNoteOwner"
        :can-view-user-notes="canViewUserNotes"
        :can-delete-any-note="canDeleteAnyNote"
        :can-update-any-note="canUpdateAnyNote"
        @toggle-note-update="isInUpdateMode = !isInUpdateMode"
        @toggle-user-comments-modal="
          emits('toggle-user-comments-modal', createdBy.id, createdBy.fullName)
        "
      />
    </template>

    <template #description>
      <n-tooltip trigger="hover" placement="right">
        <template #trigger>
          <n-text depth="3">
            <small>{{ dateService.fromNow(note.createdAt) }}</small>
          </n-text>
        </template>

        {{ dateService.format(note.createdAt, "YYYY-MM-DD HH:mm") }}
      </n-tooltip>
    </template>

    <!-- @TODO markdown compiler -->
    <n-input
      resizable
      v-if="isInUpdateMode"
      v-model:value="updatedValue"
      type="textarea"
      :autosize="{
        minRows: 5,
      }"
    />

    <n-card v-else>
      {{ note.value }}
    </n-card>

    <template #footer>
      <n-space v-if="isInUpdateMode" class="w-100" justify="space-between">
        <n-button type="warning" secondary> Cancel </n-button>

        <n-button type="info" secondary> Save </n-button>
      </n-space>
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import {
  NTag,
  NCard,
  NText,
  NInput,
  NSpace,
  NThing,
  NAvatar,
  NButton,
  NTooltip,
} from "naive-ui";
import { toRefs, type PropType, ref } from "vue";

import { useAuthStore } from "@/store/auth";
import ActionsDropdown from "./ActionsDropdown.vue";
import { defineComputed } from "@/helpers/defineComputed";
import { useDateService } from "@/services/useDateService";
import { Permission } from "@shared/types/enums/Permission";
import type { INoteDto } from "@shared/types/dtos/INoteDto";

const authStore = useAuthStore();
const dateService = useDateService();

const props = defineProps({
  note: {
    type: Object as PropType<INoteDto>,
    required: true,
  },
});

const emits = defineEmits(["toggle-user-comments-modal"]);

const updatedValue = ref("");
const isInUpdateMode = ref(false);

const { note } = toRefs(props);

const {
  initials,
  createdBy,
  isNoteOwner,
  canViewUserNotes,
  canUpdateAnyNote,
  canDeleteAnyNote,
} = defineComputed({
  initials() {
    const [name, surname] = props.note.createdBy.fullName.split(" ");

    return `${name[0]}${surname[0]}`;
  },

  createdBy() {
    return props.note.createdBy;
  },

  isNoteOwner() {
    return authStore.loggedUserId === createdBy.value.id;
  },

  canViewUserNotes() {
    return authStore.hasPermission(Permission.ViewUserNotes);
  },

  canUpdateAnyNote() {
    return authStore.hasPermission(Permission.UpdateAnyNote);
  },

  canDeleteAnyNote() {
    return authStore.hasPermission(Permission.DeleteAnyNote);
  },
});
</script>
