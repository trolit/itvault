<template>
  <n-dropdown
    :width="250"
    trigger="click"
    :options="options"
    data-cy="brand-dropdown"
    @select="onSelect"
  >
    <n-button quaternary>
      <brand :custom-icon="activeIcon" />
    </n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import {
  Help as HelpIcon,
  Group as UsersIcon,
  UserRole as RolesIcon,
  UpdateNow as UpdatesIcon,
  Development as BrandIcon,
  Workspace as WorkspacesIcon,
} from "@vicons/carbon";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { NDropdown, NButton } from "naive-ui";

import {
  ROUTE_USERS_NAME,
  ROUTE_GUIDE_NAME,
  ROUTE_ROLES_NAME,
  ROUTE_UPDATES_NAME,
  ROUTE_DASHBOARD_NAME,
  ROUTE_WORKSPACES_NAME,
} from "@/assets/constants/routes";
import { useAuthStore } from "@/store/auth";
import renderIcon from "@/helpers/renderIcon";
import Brand from "@/components/common/Brand.vue";
import { Permission } from "@shared/types/enums/Permission";

const router = useRouter();
const authStore = useAuthStore();

const currentRouteName = computed(() => router.currentRoute.value.name);

const activeIcon = computed(() => {
  switch (currentRouteName.value) {
    case ROUTE_USERS_NAME:
      return UsersIcon;

    case ROUTE_ROLES_NAME:
      return RolesIcon;

    case ROUTE_GUIDE_NAME:
      return HelpIcon;

    case ROUTE_UPDATES_NAME:
      return UpdatesIcon;

    case ROUTE_WORKSPACES_NAME:
      return WorkspacesIcon;

    default:
      return BrandIcon;
  }
});

const options = computed(() => [
  {
    label: "Dashboard",
    key: ROUTE_DASHBOARD_NAME,
    icon: renderIcon(BrandIcon),
    show: currentRouteName.value !== ROUTE_DASHBOARD_NAME,
  },
  {
    label: "Users",
    key: ROUTE_USERS_NAME,
    icon: renderIcon(UsersIcon),
    show:
      authStore.hasPermission(Permission.ViewAllUsers) &&
      currentRouteName.value !== ROUTE_USERS_NAME,
  },
  {
    label: "Roles",
    key: ROUTE_ROLES_NAME,
    icon: renderIcon(RolesIcon),
    show:
      authStore.hasAtLeastOnePermission([
        Permission.CreateRole,
        Permission.UpdateRole,
      ]) && currentRouteName.value !== ROUTE_ROLES_NAME,
  },
  {
    label: "Guide",
    key: ROUTE_GUIDE_NAME,
    icon: renderIcon(HelpIcon),
    show: currentRouteName.value !== ROUTE_GUIDE_NAME,
  },
  {
    label: "Updates",
    key: ROUTE_UPDATES_NAME,
    icon: renderIcon(UpdatesIcon),
    show: currentRouteName.value !== ROUTE_UPDATES_NAME,
  },
]);

function onSelect(key: string) {
  router.push({ name: key });
}
</script>
