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
        <n-thing v-for="note in usersStore.notes.result" :key="note.id">
          <template #header-extra>
            <div class="align-center">
              <n-icon :component="TimeIcon" :size="20" :depth="5" />

              <small>{{ dateService.fromNow(note.createdAt) }}</small>
            </div>
          </template>

          <n-card>
            {{ note.value }}
          </n-card>
        </n-thing>

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
import { Timer as TimeIcon } from "@vicons/carbon";
import { computed, ref, toRefs, watch } from "vue";

import { useUsersStore } from "@/store/users";
import { useDateService } from "@/services/useDateService";

const page = ref(1);
const isLoading = ref(false);
const usersStore = useUsersStore();
const dateService = useDateService();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },

  fullName: {
    type: String,
    required: true,
  },
});

const { id } = toRefs(props);

watch(id, async () => {
  page.value = 1;

  fetchNotes();
});

const title = computed(() => `${props.fullName}'s notes`);
const areAllNotesFetched = computed(
  () => usersStore.notes.result.length === usersStore.notes.total
);

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
