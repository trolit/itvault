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
      <div v-if="!!user">
        <n-space vertical :size="0">
          <span :style="{ fontSize: '35px' }">{{ user.fullName }}</span>

          <span>
            <n-text :depth="3">
              {{ user.email }}
            </n-text>
            /
            {{ user.roleName }}
          </span>
        </n-space>

        <n-divider />
      </div>

      <loading-section v-if="isLoading" />

      <div v-else>
        <small :style="{ marginBottom: '20px', display: 'block' }">
          <n-text :depth="3">
            List of workspaces that can be accessed by user. Keep in mind that
            if user has role with 'view all workspaces' permission, this list is
            not taken into account!
          </n-text>
        </small>

        <n-text v-if="!data.value.length" :depth="3" :italic="true">
          &lt; List is empty &gt;
        </n-text>

        <n-space v-else :size="[10, 15]">
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

        <div :style="{ marginTop: '20px' }">
          <asynchronous-select
            :value="null"
            :options="options"
            :loading="isLoadingOptions"
            placeholder="Type to find workspace"
            :consistent-menu-width="false"
            :style="{ marginTop: '5px' }"
            @select="onSelect"
            @filter="onWorkspacesFilter"
          />
        </div>
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
          :loading="isUpdatingUser"
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
import type { IUserDTO } from "@shared/types/DTOs/User";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";
import type { IWorkspaceDTO } from "@shared/types/DTOs/Workspace";
import LoadingSection from "@/components/common/LoadingSection.vue";
import AsynchronousSelect from "@/components/common/AsynchronousSelect.vue";

interface IProps {
  isVisible: boolean;

  user: IUserDTO | null;
}

const usersStore = useUsersStore();
const generalStore = useGeneralStore();
const workspacesStore = useWorkspacesStore();

const props = defineProps<IProps>();
const { isVisible } = toRefs(props);

const emits = defineEmits(["close"]);

const isLoading = ref(false);
const isUpdatingUser = ref(false);
const isLoadingOptions = ref(false);
const workspacesSearchTimeoutId = ref(0);
const data: { initialValue: IWorkspaceDTO[]; value: IWorkspaceDTO[] } =
  reactive({ initialValue: [], value: [] });

const { isInitialValue, options } = defineComputed({
  isInitialValue() {
    return JSON.stringify(data.value) === JSON.stringify(data.initialValue);
  },

  options() {
    return workspacesStore.recentlyFilteredItems
      .map(workspace => ({
        label: workspace.name,
        value: workspace.id,
      }))
      .filter(item => data.value.every(element => element.id !== item.value));
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

      if (!options.value.length) {
        onWorkspacesFilter("");
      }
    },
  },
});

function onSelect(workspaceId: number) {
  const workspace = workspacesStore.recentlyFilteredItems.find(
    workspace => workspace.id === workspaceId
  );

  if (workspace) {
    data.value.push(workspace);
  }
}

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

  isUpdatingUser.value = true;

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
    isUpdatingUser.value = false;
  }
}

function onWorkspacesFilter(value: string) {
  if (workspacesSearchTimeoutId.value) {
    clearTimeout(workspacesSearchTimeoutId.value);
  }

  workspacesSearchTimeoutId.value = setTimeout(async () => {
    isLoadingOptions.value = true;

    try {
      const { result } = await workspacesStore.getAll({
        page: 1,
        perPage: 5,
        filters: {
          name: value || undefined,
        },
      });

      workspacesStore.recentlyFilteredItems = result;

      if (!result.length) {
        generalStore.messageProvider.info(
          `No workspaces found with name: ${value}`
        );
      }
    } catch (error) {
      console.log(error);

      generalStore.messageProvider.error(
        "There was an error when trying to find workspaces!"
      );
    } finally {
      isLoadingOptions.value = false;
    }
  }, 250);
}
</script>
