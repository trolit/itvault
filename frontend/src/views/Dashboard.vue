<template>
  <div class="dashboard-page page">
    <n-grid
      x-gap="20"
      y-gap="20"
      class="grid"
      responsive="screen"
      cols="1 s:1 m:3 l:3 xl:3 2xl:3"
    >
      <n-grid-item class="profile-card-wrapper" span="1">
        <profile-card />
      </n-grid-item>

      <n-grid-item class="workspaces-card-wrapper" span="2">
        <workspaces-card />
      </n-grid-item>

      <n-grid-item class="other-cards-wrapper" span="3">
        <n-grid
          x-gap="20"
          y-gap="20"
          responsive="screen"
          cols="1 s:1 m:3 l:3 xl:3 2xl:3"
        >
          <n-grid-item
            v-for="(
              { title, to, icon, description, props }, index
            ) of otherCards"
            v-bind="props"
            class="other-card-wrapper"
            :key="index"
          >
            <ref-card
              :to="to"
              :icon="icon"
              :title="title"
              :description="description"
            />
          </n-grid-item>
        </n-grid>
      </n-grid-item>
    </n-grid>

    <add-edit-workspace-drawer />
  </div>
</template>

<script setup lang="ts">
import {
  Help as HelpIcon,
  Email as EmailIcon,
  UpdateNow as UpdatesIcon,
} from "@vicons/carbon";
import { NGrid, NGridItem } from "naive-ui";
import { ref, shallowRef, type Component, type Ref } from "vue";

import {
  ROUTE_GUIDE_NAME,
  ROUTE_UPDATES_NAME,
} from "@/assets/constants/routes";
import RefCard from "@/components/dashboard/RefCard.vue";
import ProfileCard from "@/components/dashboard/Profile.vue";
import WorkspacesCard from "@/components/dashboard/Workspaces.vue";
import AddEditWorkspaceDrawer from "@/components/dashboard/AddEditWorkspaceDrawer.vue";

interface OtherCard {
  title: string;
  to: string;
  icon: Component;
  props?: object;
  description: string;
}

const otherCards: Ref<OtherCard[]> = ref([
  {
    title: "Guide",
    to: ROUTE_GUIDE_NAME,
    icon: shallowRef(HelpIcon),
    description:
      "This section describes available features and how to use them.",
  },

  {
    title: "Updates",
    to: ROUTE_UPDATES_NAME,
    icon: shallowRef(UpdatesIcon),
    description: "Complete log of changes made to the project.",
  },

  // @TODO Create [Contact] view
  {
    title: "Contact",
    to: ROUTE_UPDATES_NAME,
    icon: shallowRef(EmailIcon),
    description: "Need help? Found an issue? Send us an ticket.",
  },
]);
</script>
