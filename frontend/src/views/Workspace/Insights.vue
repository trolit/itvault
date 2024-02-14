<template>
  <div class="insights-page page">
    <n-layout has-sider>
      <n-grid
        x-gap="0"
        y-gap="20"
        responsive="screen"
        cols="1 s:1 m:5 l:5 xl:5 2xl:5"
      >
        <n-grid-item :span="1">
          <n-layout-sider bordered width="100%">
            <n-menu
              v-model:value="insightsStore.activeKey"
              :options="menuOptions"
            />
          </n-layout-sider>
        </n-grid-item>

        <n-grid-item :span="4">
          <n-layout>
            <div class="content-wrapper">
              <component v-if="componentToRender" :is="componentToRender" />

              <div v-else>No component provided!</div>
            </div>
          </n-layout>
        </n-grid-item>
      </n-grid>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import {
  Events as MembersIcon,
  SecurityServices as LogsIcon,
  ChartLine as ActivityChartsIcon,
} from "@vicons/carbon";
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import type { MenuOption } from "naive-ui";
import { NLayout, NLayoutSider, NMenu, NGrid, NGridItem } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import renderIcon from "@/helpers/renderIcon";
import { useInsightsStore } from "@/store/insights";
import { defineComputed } from "@/helpers/defineComputed";
import { Permission } from "@shared/types/enums/Permission";
import { ROUTE_DASHBOARD_NAME } from "@/assets/constants/routes";
import MembersTab from "@/components/workspace/insights/MembersTab/Index.vue";

const router = useRouter();
const authStore = useAuthStore();
const insightsStore = useInsightsStore();

onBeforeMount(() => {
  if (!authStore.hasPermission(Permission.ViewWorkspaceInsights)) {
    router.push({ name: ROUTE_DASHBOARD_NAME });
  }
});

const menuOptions: (MenuOption & { component: object | null })[] = [
  {
    key: "members",
    label: "Members",
    icon: renderIcon(MembersIcon),
    component: MembersTab,
  },
  {
    key: "activity-charts",
    label: "Activity charts",
    icon: renderIcon(ActivityChartsIcon),
    component: null,
  },
  {
    key: "log",
    label: "Log",
    icon: renderIcon(LogsIcon),
    component: null,
  },
];

const { componentToRender } = defineComputed({
  componentToRender() {
    const option = menuOptions.find(
      option => option.key === insightsStore.activeKey
    );

    return option?.component;
  },
});
</script>
