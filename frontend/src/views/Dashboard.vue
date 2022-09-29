<template>
  <div class="dashboard-page page">
    <n-grid
      x-gap="20"
      y-gap="20"
      class="grid"
      responsive="screen"
      cols="1 s:1 m:3 l:3 xl:3 2xl:3"
    >
      <n-grid-item class="profile-card-wrapper">
        <profile-card />
      </n-grid-item>

      <n-grid-item class="workspaces-card-wrapper">
        <workspaces-card />
      </n-grid-item>

      <n-grid-item class="other-cards-wrapper">
        <n-grid x-gap="20" y-gap="20" cols="2">
          <n-grid-item
            v-for="({ title, to, icon, description }, index) of otherCards"
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
  </div>
</template>

<script setup lang="ts">
import {
  Help as HelpIcon,
  Email as EmailIcon,
  UpdateNow as UpdatesIcon,
  InformationSquare as AboutIcon,
} from "@vicons/carbon";
import { NGrid, NGridItem } from "naive-ui";
import { ref, shallowRef, type Component } from "vue";

import {
  ROUTE_ABOUT_NAME,
  ROUTE_GUIDE_NAME,
  ROUTE_UPDATES_NAME,
} from "@/assets/constants/routes";
import RefCard from "@/components/dashboard/RefCard.vue";
import ProfileCard from "@/components/dashboard/Profile.vue";
import WorkspacesCard from "@/components/dashboard/Workspaces.vue";

interface OtherCard {
  title: string;
  to: string;
  icon: Component;
  description: string;
}

const otherCards = ref<Array<OtherCard>>([
  {
    title: "About",
    to: ROUTE_ABOUT_NAME,
    icon: shallowRef(AboutIcon),
    description:
      "Learn more about project features, integrations, security & privacy.",
  },

  {
    title: "Guide",
    to: ROUTE_GUIDE_NAME,
    icon: shallowRef(HelpIcon),
    description: "This section describes how to use.",
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
    description:
      "Found issue when using itvault? Send us details and we will investigate issue.",
  },
]);
</script>
