<template>
  <div class="top-panel">
    <n-grid
      :cols="isSidebarCollapsed ? 1 : 3"
      :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
    >
      <n-grid-item
        v-for="({ name, icon, tooltip }, index) of routes"
        :key="index"
      >
        <n-tooltip :show-arrow="false" placement="top-start" trigger="hover">
          <template #trigger>
            <n-button
              text
              strong
              :type="isPageActive(name) ? 'success' : 'default'"
            >
              <n-icon size="20" @click="changeRoute(name)">
                <component :is="icon" />
              </n-icon>
            </n-button>
          </template>

          {{ tooltip }}
        </n-tooltip>
      </n-grid-item>
    </n-grid>

    <n-divider v-if="isSidebarCollapsed" dashed />

    <n-tag v-else>Workspaces</n-tag>
  </div>
</template>

<script setup lang="ts">
import {
  NTag,
  NGrid,
  NIcon,
  NButton,
  NDivider,
  NTooltip,
  NGridItem,
} from "naive-ui";
import {
  Help as HelpIcon,
  UpdateNow as UpdatesIcon,
  InformationSquare as AboutIcon,
} from "@vicons/carbon";
import { shallowRef, computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { usePreferencesStore } from "@/stores/preferences";

import {
  ROUTE_ABOUT,
  ROUTE_GUIDE,
  ROUTE_UPDATES,
} from "@/assets/constants/routes";

const routes = ref([
  {
    name: ROUTE_ABOUT,
    icon: shallowRef(AboutIcon),
    tooltip: "Details",
  },
  {
    name: ROUTE_GUIDE,
    icon: shallowRef(HelpIcon),
    tooltip: "Guide",
  },
  {
    name: ROUTE_UPDATES,
    icon: shallowRef(UpdatesIcon),
    tooltip: "Updates",
  },
]);

const route = useRoute();
const router = useRouter();

function changeRoute(name: string): void {
  router.push({ name });
}

function isPageActive(name: string): boolean {
  return route.name === name;
}

const preferencesStore = usePreferencesStore();

const isSidebarCollapsed = computed((): boolean => {
  return preferencesStore.isSidebarCollapsed;
});
</script>
