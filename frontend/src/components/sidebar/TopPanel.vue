<template>
  <div class="top-panel">
    <n-grid :cols="3">
      <n-grid-item
        v-for="({ name, icon, tooltip }, index) of routes"
        :key="index"
      >
        <n-tooltip placement="top-start" trigger="hover">
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

    <n-tag>Workspaces</n-tag>
  </div>
</template>

<script setup lang="ts">
import {
  Help as HelpIcon,
  UpdateNow as UpdatesIcon,
  InformationSquare as AboutIcon,
} from "@vicons/carbon";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NButton, NIcon, NGrid, NGridItem, NTag, NTooltip } from "naive-ui";

import {
  ROUTE_ABOUT,
  ROUTE_GUIDE,
  ROUTE_UPDATES,
} from "@/assets/constants/routes";

const routes = ref([
  {
    name: ROUTE_ABOUT,
    icon: AboutIcon,
    tooltip: "Details",
  },
  {
    name: ROUTE_GUIDE,
    icon: HelpIcon,
    tooltip: "Guide",
  },
  {
    name: ROUTE_UPDATES,
    icon: UpdatesIcon,
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
</script>
