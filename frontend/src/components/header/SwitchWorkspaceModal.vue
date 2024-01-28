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
      :value="input"
      clearable
      type="text"
      placeholder="start typing"
      @update:value="onInputChange"
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
          @open="open(item)"
        />
      </n-space>
    </n-scrollbar>
  </n-modal>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, watch, type Ref, toRefs } from "vue";
import { NModal, NInput, NSpace, NScrollbar, NEmpty, NIcon } from "naive-ui";

import { useGeneralStore } from "@/store/general";
import { BLUEPRINTS_TAB } from "@/config/constants";
import { Search as SearchIcon } from "@vicons/carbon";
import { useWorkspacesStore } from "@/store/workspaces";
import type { Emits, Props } from "@/types/CommonModalTypes";
import { ROUTE_WORKSPACES_NAME } from "@/assets/constants/routes";
import type { IWorkspaceDTO } from "@shared/types/DTOs/Workspace";
import LoadingSection from "@/components/common/LoadingSection.vue";
import SingleItem from "@/components/dashboard/WorkspacesCard/SingleItem.vue";

const router = useRouter();
const generalStore = useGeneralStore();
const workspacesStore = useWorkspacesStore();

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { isVisible } = toRefs(props);

const input = ref("");
const isLoading = ref(false);
const inputSearchTimeoutId = ref(0);
const items: Ref<IWorkspaceDTO[]> = ref([]);

async function getWorkspaces(value?: string) {
  isLoading.value = true;

  try {
    const response = await workspacesStore.getAll(
      {
        page: 1,
        perPage: 5,
        filters: {
          name: value,
        },
      },
      { keepInStore: false }
    );

    items.value = response.result.filter(
      item => item.id !== workspacesStore.activeItemId
    );
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error(
      "There was an error when trying to fetch workspaces."
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

function onInputChange(value: string) {
  if (!value) {
    input.value = "";

    return;
  }

  if (inputSearchTimeoutId.value) {
    clearTimeout(inputSearchTimeoutId.value);
  }

  input.value = value;

  inputSearchTimeoutId.value = setTimeout(() => getWorkspaces(value), 250);
}

async function open(workspace: IWorkspaceDTO) {
  workspacesStore.setActiveItem(workspace);

  await router.push({
    name: ROUTE_WORKSPACES_NAME,
    params: {
      slug: workspace.slug,
      section: BLUEPRINTS_TAB,
    },
  });

  emit("update:is-visible", false);
}
</script>
