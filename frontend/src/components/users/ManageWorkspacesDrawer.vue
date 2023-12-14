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
      <n-h2 v-if="!!user">{{ user.fullName }}</n-h2>

      <loading-section v-if="isLoading" />

      <empty v-else-if="!data.value.length" title="Workspaces not found." />

      <div v-else>
        <small>
          <n-text :depth="3">
            Please note that if user has role that enables to view all
            workspaces, this configuration is not taken into account.
          </n-text>
        </small>

        <n-divider />

        <n-h4>List of workspaces</n-h4>

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
          <n-button secondary :disabled="isLoading" @click="$emit('close')">
            Cancel
          </n-button>

          <n-button
            type="warning"
            @click="onReset"
            :disabled="isLoading || isInitialValue"
          >
            Reset
          </n-button>
        </n-space>

        <n-button
          type="info"
          :disabled="isLoading || isInitialValue"
          @click="setWorkspaces"
        >
          Save
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  NH2,
  NH4,
  NTag,
  NText,
  NSpace,
  NButton,
  NDrawer,
  NDivider,
  NDrawerContent,
} from "naive-ui";
import cloneDeep from "lodash/cloneDeep";
import { reactive, ref, toRefs } from "vue";

import { useUsersStore } from "@/store/users";
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

const usersStore = useUsersStore();
const generalStore = useGeneralStore();
const workspacesStore = useWorkspacesStore();

const props = defineProps<IProps>();
const { isVisible } = toRefs(props);

const emits = defineEmits(["close"]);

const isLoading = ref(false);
const data: { initialValue: IWorkspaceDto[]; value: IWorkspaceDto[] } =
  reactive({ initialValue: [], value: [] });

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

async function setWorkspaces() {
  if (!props.user) {
    return;
  }

  isLoading.value = true;

  try {
    await usersStore.patchWorkspacesAccessibleByUser(props.user.id, data.value);

    generalStore.messageProvider.success(
      `${props.user.fullName} workspaces access updated!`
    );

    emits("close");
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error(
      "There was an error when setting user workspaces."
    );
  } finally {
    isLoading.value = false;
  }
}
</script>
