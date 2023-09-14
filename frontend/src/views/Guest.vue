<template>
  <div class="guest-page page">
    <theme-selector>
      <template #default>
        <n-button text :focusable="false" class="theme-selector">
          <icon :value="RainDropIcon" :size="40" />
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
              <template #extra-text> keep source code knowledge </template>
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
        <n-grid responsive="screen" cols="1" :y-gap="40">
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
    header: "Extract features on demand",
    text: "Extract project features (related source code) from vault when needed.",
  },
  {
    icon: shallowRef(PersistCodeIcon),
    header: "Persist code knowledge",
    text: "Provide more insights on your/company codebase for developer(s). Reduce time needed to understand/remind how specific features are/were implemented.",
  },
  {
    icon: shallowRef(YagniIcon),
    header: "Boot new project with YAGNI",
    text: "Initialize new project without excessive code. Expand it when needed.",
  },
  {
    icon: shallowRef(TimerIcon),
    header: "Save developer(s) time",
    text: "Use vault to allow developer(s) to instantly obtain feature related source code instead of asking others to help implement it in different project.",
  },
]);
</script>
