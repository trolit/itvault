<template>
  <div class="settings-page page">
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
              v-model:value="settingsStore.activeKey"
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
  Catalog as ProfileIcon,
  Password as PasswordIcon,
  SessionBorderControl as SessionIcon,
  ApplicationWeb as ApplicationWebIcon,
} from "@vicons/carbon";
import type { MenuOption } from "naive-ui";
import { NLayout, NLayoutSider, NMenu, NGrid, NGridItem } from "naive-ui";

import renderIcon from "@/helpers/renderIcon";
import { useSettingsStore } from "@/store/settings";
import AppSettings from "@/components/settings/App.vue";
import { defineComputed } from "@/helpers/defineComputed";
import ProfileSettings from "@/components/settings/Profile.vue";
import PasswordSettings from "@/components/settings/Password.vue";
import SessionsManagement from "@/components/settings/Sessions.vue";

const settingsStore = useSettingsStore();

const menuOptions: (MenuOption & { component: object | null })[] = [
  {
    key: "app",
    label: "App",
    icon: renderIcon(ApplicationWebIcon),
    component: AppSettings,
  },
  {
    key: "profile",
    label: "Profile",
    icon: renderIcon(ProfileIcon),
    component: ProfileSettings,
  },
  {
    key: "password",
    label: "Change password",
    icon: renderIcon(PasswordIcon),
    component: PasswordSettings,
  },
  {
    key: "sessions",
    label: "Sessions",
    icon: renderIcon(SessionIcon),
    component: SessionsManagement,
  },
];

const { componentToRender } = defineComputed({
  componentToRender() {
    const option = menuOptions.find(
      option => option.key === settingsStore.activeKey
    );

    return option?.component;
  },
});
</script>
