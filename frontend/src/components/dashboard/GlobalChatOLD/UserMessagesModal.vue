<template>
  <n-modal :title="title" preset="dialog" :bordered="true">
    <n-input
      clearable
      show-count
      :disabled="isLoading"
      placeholder="Find by phrase"
    />

    <n-scrollbar :style="{ marginTop: '10px', height: '80vh' }">
      <n-space vertical size="large">
        <n-thing
          v-for="note in usersStore.notes.result"
          :key="note.id"
          :style="{ opacity: note.isDeleted ? 0.4 : 1 }"
        >
          <template #header-extra>
            <div class="align-center">
              <n-icon :component="TimeIcon" :size="20" :depth="5" />

              <small>{{ dateService.fromNow(note.createdAt) }}</small>
            </div>
          </template>

          <n-card>
            <div
              v-html="markdown.render(note.value)"
              class="note-render-area"
            />
          </n-card>
        </n-thing>

        <n-space
          v-if="isLoading && !usersStore.notes.result.length"
          justify="center"
        >
          <loading-section />
        </n-space>

        <n-space v-if="usersStore.notes.result.length" justify="center">
          <n-button
            :disabled="areAllNotesFetched"
            :loading="isLoading"
            @click="onLoadMore"
          >
            Load more
          </n-button>
        </n-space>
      </n-space>
    </n-scrollbar>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NCard,
  NIcon,
  NSpace,
  NModal,
  NThing,
  NInput,
  NButton,
  NScrollbar,
} from "naive-ui";
import { ref, toRefs } from "vue";
import { Timer as TimeIcon } from "@vicons/carbon";

import { useUsersStore } from "@/store/users";
import { defineComputed } from "@/helpers/defineComputed";
import { useDateService } from "@/services/useDateService";
import { defineWatchers } from "@/helpers/defineWatchers";
import { useMarkdownService } from "@/services/useMarkdownService";
import LoadingSection from "@/components/common/LoadingSection.vue";

interface IProps {
  id: number;

  fullName: string;
}

const props = defineProps<IProps>();

const usersStore = useUsersStore();
const dateService = useDateService();
const markdown = useMarkdownService();

const page = ref(1);
const isLoading = ref(false);

const { id } = toRefs(props);

const { title, areAllNotesFetched } = defineComputed({
  title() {
    return `${props.fullName}'s notes`;
  },

  areAllNotesFetched() {
    return usersStore.notes.result.length === usersStore.notes.total;
  },
});

defineWatchers({
  id: {
    source: id,
    handler: () => {
      page.value = 1;

      fetchNotes();
    },
  },
});

function onLoadMore() {
  page.value = page.value + 1;

  fetchNotes();
}

async function fetchNotes() {
  isLoading.value = true;

  try {
    await usersStore.getNotes(page.value, id.value);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
