<template>
  <n-modal
    :show="isVisible"
    preset="dialog"
    class="switch-workspace-modal"
    :closable="true"
    :show-icon="false"
    :mask-closable="false"
    @close="$emit('update:is-visible', false)"
  >
    <template #header> Change workspace </template>

    <n-input
      v-model:value="value"
      clearable
      type="text"
      placeholder="start typing"
    >
      <template #prefix>
        <n-icon :component="SearchIcon" />
      </template>
    </n-input>

    <n-scrollbar>
      <loading-section v-if="isLoading" />

      <n-empty v-else-if="!items.length" description="Nothing found" />

      <n-space vertical v-else>
        <single-item
          v-for="(item, index) in items"
          hide-pin-manager
          hide-edit-button
          :key="index"
          :item="item"
        />
      </n-space>
    </n-scrollbar>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch, type Ref, toRefs } from "vue";
import { NModal, NInput, NSpace, NScrollbar, NEmpty, NIcon } from "naive-ui";

import { useGeneralStore } from "@/store/general";
import { Search as SearchIcon } from "@vicons/carbon";
import { useWorkspacesStore } from "@/store/workspaces";
import type { Emits, Props } from "@/types/CommonModalTypes";
import type { IWorkspaceDTO } from "@shared/types/DTOs/Workspace";
import LoadingSection from "@/components/common/LoadingSection.vue";
import SingleItem from "@/components/dashboard/WorkspacesCard/SingleItem.vue";

const generalStore = useGeneralStore();
const workspacesStore = useWorkspacesStore();

const props = defineProps<Props>();
defineEmits<Emits>();

const { isVisible } = toRefs(props);

const value = ref("");
const isLoading = ref(false);
const items: Ref<IWorkspaceDTO[]> = ref([]);

async function getWorkspaces() {
  isLoading.value = true;

  try {
    const response = await workspacesStore.getAll(
      {
        page: 1,
        perPage: 5,
        filters: {},
      },
      { keepInStore: false }
    );

    items.value = response.result;
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error(
      "There was an error when trying to load workspaces."
    );
  } finally {
    isLoading.value = false;
  }
}

watch(isVisible, value => {
  if (value && !items.value.length) {
    getWorkspaces();
  }
});
</script>
