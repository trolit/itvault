<template>
  <div class="welcome-page page">
    <n-grid
      x-gap="16"
      y-gap="16"
      class="grid"
      item-responsive
      responsive="screen"
      cols="s:1 m:3 l:3 xl:3 2xl:3"
    >
      <n-grid-item class="information">
        <ref-card :icon="FaceActivatedIcon" title="Welcome,">
          <template #description> elo </template>
        </ref-card>
      </n-grid-item>

      <n-grid-item class="workspaces-wrapper">
        <workspaces />
      </n-grid-item>

      <n-grid-item class="others">
        <n-grid y-gap="20" cols="1">
          <n-grid-item
            v-for="({ title, to, icon, description }, index) of otherCards"
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
  UpdateNow as UpdatesIcon,
  InformationSquare as AboutIcon,
} from "@vicons/carbon";
import { ref, shallowRef, type Component } from "vue";
import { NGrid, NGridItem } from "naive-ui";
import { FaceActivated as FaceActivatedIcon } from "@vicons/carbon";

import {
  ROUTE_ABOUT,
  ROUTE_GUIDE,
  ROUTE_UPDATES,
} from "@/assets/constants/routes";
import RefCard from "./RefCard.vue";
import Workspaces from "./Workspaces.vue";

interface OtherCard {
  title: string;
  to: string;
  icon: Component;
  description: string;
}

const otherCards = ref<Array<OtherCard>>([
  {
    title: "About",
    to: ROUTE_ABOUT,
    icon: shallowRef(AboutIcon),
    description: "Learn more about project, it's features and integrations.",
  },

  {
    title: "Guide",
    to: ROUTE_GUIDE,
    icon: shallowRef(HelpIcon),
    description: "This section describes how to use itvault.",
  },

  {
    title: "Updates",
    to: ROUTE_UPDATES,
    icon: shallowRef(UpdatesIcon),
    description: "Complete log of changes made to the project.",
  },
]);
</script>
