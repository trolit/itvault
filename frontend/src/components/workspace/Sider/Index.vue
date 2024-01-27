<template>
  <div id="sider" class="sider">
    <n-tabs
      animated
      type="line"
      size="medium"
      :value="workspacesStore.generalLayoutSiderKey"
      justify-content="space-evenly"
      @update:value="onTabUpdate"
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
import { GENERAL_LAYOUT_SIDER_KEYS } from "@/config/constants";
import { silentlyUpdateUrl } from "@/helpers/silentlyUpdateUrl";
import { ROUTE_WORKSPACES_NAME } from "@/assets/constants/routes";

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
    key: GENERAL_LAYOUT_SIDER_KEYS.BLUEPRINTS_TAB,
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
    key: GENERAL_LAYOUT_SIDER_KEYS.FILES_TAB,
    text: "Files",
    tab: FilesTab,
    props: {
      isLoadingFileFromUrl: isLoadingFileFromUrl.value,
    },
    events: {},
  },
  {
    key: GENERAL_LAYOUT_SIDER_KEYS.BUNDLES_TAB,
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

function onTabUpdate(key: string) {
  workspacesStore.generalLayoutSiderKey = key;

  silentlyUpdateUrl({
    pathname: `${ROUTE_WORKSPACES_NAME}/${workspacesStore.activeItem.slug}/${workspacesStore.generalLayoutSiderKey}`,
  });
}
</script>
