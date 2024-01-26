<template>
  <n-dropdown
    :width="250"
    trigger="click"
    :options="options"
    @select="handleSelect"
  >
    <n-button quaternary>
      {{ workspacesStore.activeItem.name }}
    </n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import {
  Box as FilesIcon,
  ChartRose as InsightsIcon,
  Workspace as WorkspaceIcon,
} from "@vicons/carbon";
import { computed } from "vue";
import { NDropdown, NButton } from "naive-ui";

import renderIcon from "@/helpers/renderIcon";
import { useWorkspacesStore } from "@/store/workspaces";

const workspacesStore = useWorkspacesStore();

const emit = defineEmits(["change-workspace"]);

const options = computed(() => [
  {
    label: "Change",
    key: "change-workspace",
    icon: renderIcon(WorkspaceIcon),
  },
  {
    label: "View insights",
    key: "insights",
    icon: renderIcon(InsightsIcon),
    show: false,
  },
  {
    label: "View files",
    key: "files",
    icon: renderIcon(FilesIcon),
    show: false,
  },
]);

function handleSelect(key: "change-workspace" | "insights" | "files") {
  if (key === "change-workspace") {
    emit("change-workspace");

    return;
  }
}
</script>
