<template>
  <n-dropdown
    :width="250"
    trigger="click"
    :options="options"
    @select="onSelect"
  >
    <brand />
  </n-dropdown>
</template>

<script setup lang="ts">
import {
  Help as HelpIcon,
  Group as UsersIcon,
  UserRole as RolesIcon,
  UpdateNow as UpdatesIcon,
  Development as BrandIcon,
} from "@vicons/carbon";
import { computed } from "vue";
import { NDropdown } from "naive-ui";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/store/auth";
import renderIcon from "@/helpers/renderIcon";
import Brand from "@/components/common/Brand.vue";
import {
  ROUTE_DASHBOARD_NAME,
  ROUTE_GUIDE_NAME,
  ROUTE_ROLES_NAME,
  ROUTE_UPDATES_NAME,
  ROUTE_USERS_NAME,
} from "@/assets/constants/routes";
import { Permission } from "@shared/types/enums/Permission";

const router = useRouter();
const authStore = useAuthStore();

const options = computed(() => [
  {
    label: "Dashboard",
    key: ROUTE_DASHBOARD_NAME,
    icon: renderIcon(BrandIcon),
    show: router.currentRoute.value.name !== ROUTE_DASHBOARD_NAME,
  },
  {
    label: "Users",
    key: ROUTE_USERS_NAME,
    icon: renderIcon(UsersIcon),
    show:
      authStore.hasPermission(Permission.ViewAllUsers) &&
      router.currentRoute.value.name !== ROUTE_USERS_NAME,
  },
  {
    label: "Roles",
    key: ROUTE_ROLES_NAME,
    icon: renderIcon(RolesIcon),
    show:
      authStore.hasAtLeastOnePermission([
        Permission.CreateRole,
        Permission.UpdateRole,
      ]) && router.currentRoute.value.name !== ROUTE_ROLES_NAME,
  },
  {
    label: "Guide",
    key: ROUTE_GUIDE_NAME,
    icon: renderIcon(HelpIcon),
    show: router.currentRoute.value.name !== ROUTE_GUIDE_NAME,
  },
  {
    label: "Updates",
    key: ROUTE_UPDATES_NAME,
    icon: renderIcon(UpdatesIcon),
    show: router.currentRoute.value.name !== ROUTE_UPDATES_NAME,
  },
]);

function onSelect(key: string) {
  router.push({ name: key });
}
</script>
