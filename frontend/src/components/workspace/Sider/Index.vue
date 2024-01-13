<template>
  <div id="sider" class="sider">
    <n-tabs
      animated
      type="line"
      size="medium"
      v-model:value="workspacesStore.generalLayoutSiderKey"
      justify-content="space-evenly"
    >
      <n-tab-pane
        :name="key"
        :tab="text"
        v-for="({ key, text, tab, props, events }, index) in tabs"
        :key="index"
        :disabled="isLoading"
      >
        <component
          :is="tab"
          v-bind="props"
          v-on="events"
          :is-loading="isLoading"
          @update:is-loading="updateLoadingState"
        />
      </n-tab-pane>
    </n-tabs>

    <notes-drawer />

    <bundle-drawer />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { NTabs, NTabPane } from "naive-ui";

import FilesTab from "./FilesTab/Index.vue";
import BundlesTab from "./BundlesTab/Index.vue";
import BlueprintsTab from "./BlueprintsTab.vue";
import NotesDrawer from "./NotesDrawer/Index.vue";
import BundleDrawer from "./BundleDrawer/Index.vue";
import { useWorkspacesStore } from "@/store/workspaces";

const workspacesStore = useWorkspacesStore();

interface IProps {
  isLoadingFileFromUrl: boolean;
}

const props = defineProps<IProps>();

const { isLoadingFileFromUrl } = toRefs(props);

const bundlePage = ref(1);
const blueprintPage = ref(1);
const isLoading = ref(false);

const tabs = [
  {
    key: "blueprints",
    text: "Blueprints",
    tab: BlueprintsTab,
    props: {
      page: blueprintPage,
    },
    events: {
      "update:page": (value: number) => (blueprintPage.value = value),
    },
  },
  {
    key: "files",
    text: "Files",
    tab: FilesTab,
    props: {
      isLoadingFileFromUrl: isLoadingFileFromUrl.value,
    },
    events: {},
  },
  {
    key: "bundles",
    text: "Bundles",
    tab: BundlesTab,
    props: {
      page: bundlePage,
    },
    events: {
      "update:page": (value: number) => (bundlePage.value = value),
    },
  },
];

function updateLoadingState(value: unknown) {
  if (typeof value === "boolean") {
    isLoading.value = value;
  }
}
</script>
