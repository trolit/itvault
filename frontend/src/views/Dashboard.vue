<template>
  <div class="dashboard-page page">
    <n-grid
      x-gap="20"
      y-gap="20"
      class="grid"
      responsive="screen"
      cols="1 s:1 m:3 l:3 xl:3 2xl:3"
    >
      <n-grid-item class="other-cards-wrapper" span="5">
        <n-grid
          x-gap="20"
          y-gap="20"
          responsive="screen"
          cols="1 s:1 m:5 l:5 xl:5 2xl:5"
        >
          <n-grid-item :span="2" class="text-center">
            <welcome />
          </n-grid-item>

          <n-grid-item span="3">
            <n-grid
              x-gap="20"
              y-gap="20"
              responsive="screen"
              cols="1 s:1 m:2 l:2 xl:2 2xl:2"
            >
              <n-grid-item
                v-for="(
                  { title, to, icon, description, props }, index
                ) of topCards"
                v-bind="props"
                class="other-card-wrapper"
                :key="index"
              >
                <link-card
                  :to="to"
                  :icon="icon"
                  :title="title"
                  :description="description"
                />
              </n-grid-item>
            </n-grid>
          </n-grid-item>
        </n-grid>
      </n-grid-item>

      <n-grid-item class="workspaces-card-wrapper" span="2">
        <workspaces-card />
      </n-grid-item>

      <n-grid-item class="permissions-wrapper" span="1">
        <permissions />
      </n-grid-item>

      <n-grid-item
        v-for="({ title, to, icon, description, props }, index) of bottomCards"
        v-bind="props"
        class="other-card-wrapper"
        :key="index"
      >
        <link-card
          :to="to"
          :icon="icon"
          :title="title"
          :description="description"
        />
      </n-grid-item>
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
import LinkCard from "@/components/dashboard/LinkCard.vue";
import Permissions from "@/components/dashboard/Permissions.vue";
import WorkspacesCard from "@/components/dashboard/Workspaces.vue";
import AddEditWorkspaceDrawer from "@/components/dashboard/AddEditWorkspaceDrawer.vue";

const authStore = useAuthStore();

interface OtherCard {
  title: string;
  to: string;
  icon: Component;
  props?: object;
  description: string;
}

const bottomCards: Ref<OtherCard[]> = ref([
  {
    title: "Guide",
    to: ROUTE_GUIDE_NAME,
    icon: shallowRef(HelpIcon),
    description: "Available features description",
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

const topCards: Ref<OtherCard[]> = ref([
  {
    title: "Users",
    to: ROUTE_USERS_NAME,
    icon: shallowRef(UsersIcon),
    description: "Manage vault user(s)",
  },

  {
    title: "Roles",
    to: ROUTE_ROLES_NAME,
    icon: shallowRef(RolesIcon),
    description: "Manage vault role(s)",
  },
]);

authStore.socketSendMessage({
  type: authStore.SOCKET_MESSAGE_TYPE.VIEW_DASHBOARD.TYPE,
});
</script>
