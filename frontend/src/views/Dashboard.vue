<template>
  <div class="dashboard-page page">
    <n-grid
      x-gap="10"
      y-gap="20"
      class="grid"
      responsive="screen"
      cols="1 s:1 m:6 l:6 xl:6 2xl:6"
    >
      <n-grid-item :span="6">
        <welcome />
      </n-grid-item>

      <n-grid-item span="1">
        <n-grid
          cols="1"
          x-gap="20"
          y-gap="20"
          responsive="screen"
          class="navigation-grid"
        >
          <n-grid-item
            v-for="({ title, to, icon, description, props }, index) of navItems"
            v-bind="props"
            :key="index"
          >
            <navigation-router-link
              :to="to"
              :icon="icon"
              :title="title"
              :description="description"
            />
          </n-grid-item>
        </n-grid>
      </n-grid-item>

      <n-grid-item class="workspaces-card-wrapper" span="5">
        <workspaces-card />
      </n-grid-item>

      <!-- @TODO consider "global" chat -->
    </n-grid>

    <add-edit-workspace-drawer />
  </div>
</template>

<script setup lang="ts">
import {
  Help as HelpIcon,
  Email as EmailIcon,
  Group as UsersIcon,
  UserRole as RolesIcon,
  UpdateNow as UpdatesIcon,
} from "@vicons/carbon";
import { NGrid, NGridItem } from "naive-ui";
import { ref, shallowRef, type Component, type Ref } from "vue";

import {
  ROUTE_USERS_NAME,
  ROUTE_GUIDE_NAME,
  ROUTE_ROLES_NAME,
  ROUTE_UPDATES_NAME,
} from "@/assets/constants/routes";
import { useAuthStore } from "@/store/auth";
import Welcome from "@/components/dashboard/Welcome.vue";
import { Permission } from "@shared/types/enums/Permission";
import WorkspacesCard from "@/components/dashboard/Workspaces.vue";
import NavigationRouterLink from "@/components/dashboard/NavigationRouterLink.vue";
import AddEditWorkspaceDrawer from "@/components/dashboard/AddEditWorkspaceDrawer.vue";

const authStore = useAuthStore();

interface OtherCard {
  title: string;
  to: string;
  icon: Component;
  props?: object;
  description: string;
  isPermitted?: boolean;
}

const navItems: Ref<OtherCard[]> = ref([
  {
    title: "Users",
    to: ROUTE_USERS_NAME,
    icon: shallowRef(UsersIcon),
    description: "Manage vault user(s)",
    isPermitted: authStore.hasPermission(Permission.ViewAllUsers),
  },

  {
    title: "Roles",
    to: ROUTE_ROLES_NAME,
    icon: shallowRef(RolesIcon),
    description: "Manage vault role(s)",
    isPermitted: authStore.hasAtLeastOnePermission([
      Permission.CreateRole,
      Permission.UpdateRole,
    ]),
  },

  {
    title: "Guide",
    to: ROUTE_GUIDE_NAME,
    icon: shallowRef(HelpIcon),
    description: "Features description",
  },

  {
    title: "Updates",
    to: ROUTE_UPDATES_NAME,
    icon: shallowRef(UpdatesIcon),
    description: "Changes made to the project",
  },

  {
    title: "Contact",
    to: ROUTE_UPDATES_NAME,
    icon: shallowRef(EmailIcon),
    description: "Need help? Found an issue?",
  },
]);

authStore.socketSendMessage({
  type: authStore.SOCKET_MESSAGE_TYPE.VIEW_DASHBOARD.TYPE,
});
</script>
