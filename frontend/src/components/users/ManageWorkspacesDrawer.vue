<template>
  <n-drawer
    :show="isVisible"
    resizable
    :min-width="400"
    :default-width="400"
    placement="right"
    :show-mask="false"
    :trap-focus="false"
  >
    <n-drawer-content
      :footer-style="{
        display: 'flex',
        margin: '0 10px',
        justifyContent: 'space-between',
      }"
    >
      <n-h2 v-if="!!user">{{ user.fullName }} workspaces</n-h2>

      <loading-section v-if="isLoading" />

      <empty v-else-if="!data.value.length" title="Workspaces not found." />

      <div v-else>
        <n-space :size="[10, 15]">
          <n-tag
            v-for="(workspace, index) in data.value"
            :key="index"
            round
            closable
            type="warning"
            @close="excludeWorkspace(workspace.id)"
          >
            {{ workspace.name }}
          </n-tag>
        </n-space>
      </div>

      <template #footer>
        <n-space>
          <n-button secondary :loading="isLoading" @click="$emit('close')">
            Cancel
          </n-button>

          <n-button
            type="warning"
            :loading="isLoading"
            @click="onReset"
            :disabled="isInitialValue"
          >
            Reset
          </n-button>
        </n-space>

        <n-button
          type="info"
          :loading="isLoading"
          :disabled="isLoading || isInitialValue"
        >
          Save
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import cloneDeep from "lodash/cloneDeep";
import { reactive, ref, toRefs } from "vue";
import { NButton, NDrawer, NDrawerContent, NH2, NTag, NSpace } from "naive-ui";

import { useGeneralStore } from "@/store/general";
import Empty from "@/components/common/Empty.vue";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";
import type { IUserDto } from "@shared/types/dtos/IUserDto";
import LoadingSection from "@/components/common/LoadingSection.vue";
import type { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";

interface IProps {
  isVisible: boolean;

  user: IUserDto | null;
}

const generalStore = useGeneralStore();
const workspacesStore = useWorkspacesStore();

const props = defineProps<IProps>();
const { isVisible } = toRefs(props);

defineEmits(["close"]);

const isLoading = ref(false);
const data: { initialValue: IWorkspaceDto[]; value: IWorkspaceDto[] } =
  reactive({ initialValue: [], value: [] });

function onReset() {
  data.value = cloneDeep(data.initialValue);
}

function excludeWorkspace(id: number) {
  const workspaceIndex = data.value.findIndex(workspace => workspace.id === id);

  if (~workspaceIndex) {
    data.value.splice(workspaceIndex, 1);
  }
}

async function fetchWorkspaces(name?: string) {
  if (!props.user) {
    return;
  }

  isLoading.value = true;

  try {
    const { result } = await workspacesStore.getAll({
      ignorePagination: true,
      filters: { userId: props.user.id, name },
    });

    data.value = result;

    data.initialValue = cloneDeep(result);
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error(
      "There was an error when trying to load user workspaces."
    );
  } finally {
    isLoading.value = false;
  }
}

const { isInitialValue } = defineComputed({
  isInitialValue() {
    return JSON.stringify(data.value) === JSON.stringify(data.initialValue);
  },
});

defineWatchers({
  isVisible: {
    source: isVisible,
    handler: () => {
      if (!isVisible.value) {
        return;
      }

      fetchWorkspaces();
    },
  },
});
</script>
