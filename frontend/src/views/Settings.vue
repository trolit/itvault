<template>
  <div class="settings-page page">
    <n-layout has-sider>
      <n-layout-sider bordered :width="200">
        <n-menu
          v-model:value="settingsStore.activeKey"
          :options="menuOptions"
        />
      </n-layout-sider>

      <n-layout>
        <div class="content-wrapper">
          <component v-if="componentToRender" :is="componentToRender" />

          <div v-else>No component provided!</div>
        </div>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import {
  Catalog as ProfileIcon,
  Password as PasswordIcon,
  SessionBorderControl as SessionIcon,
} from "@vicons/carbon";
import type { MenuOption } from "naive-ui";
import { NLayout, NLayoutSider, NMenu } from "naive-ui";

import renderIcon from "@/helpers/renderIcon";
import { useSettingsStore } from "@/store/settings";
import { defineComputed } from "@/helpers/defineComputed";
import ProfileSettings from "@/components/settings/Profile.vue";
import PasswordSettings from "@/components/settings/Password.vue";

const settingsStore = useSettingsStore();

const menuOptions: MenuOption[] = [
  {
    key: "profile",
    label: "Profile",
    icon: renderIcon(ProfileIcon),
  },
  {
    key: "password",
    label: "Change password",
    icon: renderIcon(PasswordIcon),
  },
  {
    key: "sessions",
    label: "Sessions",
    icon: renderIcon(SessionIcon),
  },
];

const { componentToRender } = defineComputed({
  componentToRender() {
    if (settingsStore.activeKey === "profile") {
      return ProfileSettings;
    }

    if (settingsStore.activeKey === "password") {
      return PasswordSettings;
    }

    return null;
  },
});
</script>
