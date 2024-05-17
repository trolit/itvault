<template>
  <n-dropdown
    trigger="click"
    :options="options"
    :width="250"
    data-cy="profile-dropdown"
    @select="handleSelect"
  >
    <n-button quaternary>{{ authStore.profile.fullName }}</n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import {
  ScreenOff as LogoutIcon,
  Settings as SettingsIcon,
  Locked as PermissionsIcon,
  UserProfile as UserProfileIcon,
} from "@vicons/carbon";
import { h, ref } from "vue";
import { useRouter } from "vue-router";
import { NAvatar, NDropdown, NText, NButton, NIcon, NTag } from "naive-ui";

import {
  ROUTE_LOGIN_NAME,
  ROUTE_SETTINGS_NAME,
} from "@/assets/constants/routes";
import { useAuthStore } from "@/store/auth";
import renderIcon from "@/helpers/renderIcon";
import { useGeneralStore } from "@/store/general";
import { LoadingState } from "@/types/enums/LoadingState";

const router = useRouter();
const authStore = useAuthStore();
const generalStore = useGeneralStore();

const emits = defineEmits(["toggle-permissions-modal"]);

function renderCustomHeader() {
  return h(
    "div",
    {
      style: { display: "flex", alignItems: "center", padding: "8px 12px" },
    },
    [
      h(
        NAvatar,
        {
          round: true,
          style: { marginRight: "12px" },
        },
        { default: () => h(NIcon, { component: UserProfileIcon }) }
      ),
      h("div", null, [
        h("div", null, [
          h(NText, { depth: 2 }, { default: () => authStore.profile.fullName }),
        ]),
        h("div", { style: { fontSize: "12px" } }, [
          h(NText, { depth: 3 }, { default: () => authStore.profile.email }),
        ]),
        h("div", { style: { fontSize: "10px" } }, [
          h(
            NTag,
            { type: "info", size: "small", style: { marginTop: "5px" } },
            { default: () => authStore.profile.roleName }
          ),
        ]),
      ]),
    ]
  );
}

const options = ref([
  {
    key: "header",
    type: "render",
    render: renderCustomHeader,
  },
  {
    key: "header-divider",
    type: "divider",
  },
  {
    label: "My permissions",
    key: "permissions",
    icon: renderIcon(PermissionsIcon),
  },
  {
    label: "Settings",
    key: "settings",
    icon: renderIcon(SettingsIcon),
  },
  {
    key: "header-divider",
    type: "divider",
  },
  {
    label: "Logout",
    key: "logout",
    icon: renderIcon(LogoutIcon),
  },
]);

function handleSelect(key: string) {
  if (key === "settings") {
    router.push({ name: ROUTE_SETTINGS_NAME });

    return;
  }

  if (key === "logout") {
    logout();

    return;
  }

  if (key === "permissions") {
    emits("toggle-permissions-modal", true);
  }
}

async function logout() {
  generalStore.setLoadingState(LoadingState.Start);

  try {
    await authStore.logout();

    generalStore.setLoadingState(LoadingState.Finish);

    router.push({ name: ROUTE_LOGIN_NAME });
  } catch (error) {
    console.error(error);

    generalStore.setLoadingState(LoadingState.Error);
  }
}
</script>
