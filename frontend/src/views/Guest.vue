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
      x-gap="20"
      y-gap="20"
      class="grid"
      responsive="screen"
      cols="1 s:1 m:2 l:2 xl:2 2xl:2"
    >
      <n-grid-item :span="2">
        <brand>
          <template #extra-text> smart source code storage </template>
        </brand>
      </n-grid-item>

      <n-grid-item class="top-buttons" :span="2">
        <router-link :to="ROUTE_LOGIN_NAME">
          <n-button ghost type="tertiary" :focusable="false">
            <div class="primary-icon">
              <icon :value="SignInIcon" />
            </div>

            <div class="text">open app</div>
          </n-button>
        </router-link>
      </n-grid-item>

      <n-grid-item class="label" :span="2">
        About
        <n-divider />
      </n-grid-item>

      <n-grid-item :span="2"> T.B.D. </n-grid-item>

      <n-grid-item class="label" :span="2">
        Features
        <n-divider />
      </n-grid-item>

      <n-grid-item
        v-for="({ icon, header, text }, index) of features"
        :key="index"
        :span="2"
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

      <n-grid-item class="bottom-buttons" :span="2">
        <n-button ghost type="tertiary" :focusable="false">
          <div class="primary-icon">
            <icon :value="EmailIcon" />
          </div>

          <div class="text">Request demo</div>
        </n-button>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import {
  NGrid,
  NButton,
  NDivider,
  NGridItem,
  NDescriptions,
  NDescriptionsItem,
} from "naive-ui";
import {
  Gui as SignInIcon,
  Email as EmailIcon,
  DataVis3 as DataVisIcon,
  CloudApp as CloudAppIcon,
  RainDrop as RainDropIcon,
  ManageProtection as ManageProtectionIcon,
  AccessibilityColor as AccessibilityColorIcon,
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
    icon: shallowRef(CloudAppIcon),
    header: "Cloud",
    text: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan neque at erat interdum, et lacinia libero feugiat. Suspendisse dictum imperdiet congue. Donec elementum leo eget nulla blandit ornare vel sit amet risus.",
  },
  {
    icon: shallowRef(ManageProtectionIcon),
    header: "Protected",
    text: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan neque at erat interdum, et lacinia libero feugiat. Suspendisse dictum imperdiet congue. Donec elementum leo eget nulla blandit ornare vel sit amet risus.",
  },
  {
    icon: shallowRef(DataVisIcon),
    header: "Expanded privileges",
    text: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan neque at erat interdum, et lacinia libero feugiat. Suspendisse dictum imperdiet congue. Donec elementum leo eget nulla blandit ornare vel sit amet risus.",
  },
  {
    icon: shallowRef(AccessibilityColorIcon),
    header: "Accessible",
    text: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan neque at erat interdum, et lacinia libero feugiat. Suspendisse dictum imperdiet congue. Donec elementum leo eget nulla blandit ornare vel sit amet risus.",
  },
]);
</script>
