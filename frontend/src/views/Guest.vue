<template>
  <div class="guest-page page">
    <theme-selector>
      <template #default>
        <n-button text :focusable="false" class="theme-selector">
          <icon :value="RainDropIcon" :size="35" />
        </n-button>
      </template>
    </theme-selector>

    <n-grid
      :x-gap="50"
      class="grid"
      responsive="screen"
      cols="1 s:1 m:3 l:3 xl:3 2xl:3"
    >
      <n-grid-item :span="1">
        <n-grid responsive="screen" cols="1">
          <n-grid-item>
            <brand>
              <template #extra-text> source code storage </template>
            </brand>
          </n-grid-item>

          <n-grid-item class="top-buttons">
            <router-link :to="ROUTE_LOGIN_NAME">
              <n-button ghost type="tertiary" :focusable="false">
                <div class="primary-icon">
                  <icon :value="OpenIcon" />
                </div>

                <div class="text">open</div>
              </n-button>
            </router-link>
          </n-grid-item>
        </n-grid>
      </n-grid-item>

      <n-grid-item :span="2">
        <n-grid responsive="screen" cols="1" :x-gap="20" :y-gap="20">
          <n-grid-item
            v-for="({ icon, header, text }, index) of features"
            :key="index"
            :span="1"
            class="feature"
          >
            <n-descriptions label-placement="top" :column="4">
              <n-descriptions-item>
                <div class="icon-wrapper">
                  <icon :value="icon" />
                </div>
              </n-descriptions-item>

              <n-descriptions-item>
                <div class="text-wrapper">
                  <div class="header">{{ header }}</div>

                  <div class="text">
                    {{ text }}
                  </div>
                </div>
              </n-descriptions-item>
            </n-descriptions>
          </n-grid-item>
        </n-grid>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import {
  NGrid,
  NButton,
  NGridItem,
  NDescriptions,
  NDescriptionsItem,
} from "naive-ui";
import {
  Timer as TimerIcon,
  Network4 as OpenIcon,
  TaskStar as YagniIcon,
  RainDrop as RainDropIcon,
  DataCenter as PersistCodeIcon,
  ListChecked as ExtractOnDemandIcon,
} from "@vicons/carbon";
import { ref, shallowRef, type Ref } from "vue";

import Icon from "@/components/common/Icon.vue";
import Brand from "@/components/common/Brand.vue";
import { ROUTE_LOGIN_NAME } from "@/assets/constants/routes";
import ThemeSelector from "@/components/common/ThemeSelector.vue";

interface Feature {
  icon: object;
  header: string;
  text: string;
}

const features: Ref<Feature[]> = ref([
  {
    icon: shallowRef(ExtractOnDemandIcon),
    header: "Take chosen features on demand",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan neque at erat interdum, et lacinia libero feugiat. Suspendisse dictum imperdiet congue. Donec elementum leo eget nulla blandit ornare vel sit amet risus.",
  },
  {
    icon: shallowRef(PersistCodeIcon),
    header: "Persist code knowledge",
    text: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan neque at erat interdum, et lacinia libero feugiat. Suspendisse dictum imperdiet congue. Donec elementum leo eget nulla blandit ornare vel sit amet risus.",
  },
  {
    icon: shallowRef(YagniIcon),
    header: "Boot YAGNI project",
    text: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan neque at erat interdum, et lacinia libero feugiat. Suspendisse dictum imperdiet congue. Donec elementum leo eget nulla blandit ornare vel sit amet risus.",
  },
  {
    icon: shallowRef(TimerIcon),
    header: "Save Time",
    text: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan neque at erat interdum, et lacinia libero feugiat. Suspendisse dictum imperdiet congue. Donec elementum leo eget nulla blandit ornare vel sit amet risus.",
  },
]);
</script>
