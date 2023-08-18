<template>
  <n-drawer
    :show="isActive"
    :width="340"
    placement="left"
    to="#sider"
    :show-mask="false"
    :trap-focus="false"
    :block-scroll="false"
    :mask-closable="false"
    class="bundle-drawer"
    @update:show="onShowUpdate"
  >
    <n-drawer-content :title="`Bundle #${bundlesStore.activeItemId}`" closable>
      <div v-if="bundle">
        <!-- @TODO separate component -->
        <n-thing>
          <template #avatar>
            <n-avatar>
              <n-icon :component="UserAvatarIcon" />
            </n-avatar>
          </template>

          <template #header> {{ bundle.createdBy.fullName }} </template>

          <template #description>
            created this bundle on
            {{ formatDate(bundle.createdAt, "DD-MM-YYYY") }}
          </template>
        </n-thing>

        <n-divider />

        <n-thing>
          <template #avatar>
            <n-avatar>
              <n-icon :component="InfoIcon" />
            </n-avatar>
          </template>

          <template #header> Status </template>

          <template #description>
            <span v-if="bundle.expiresAt === BundleExpire.Never">
              This bundle never expires.
            </span>

            Bundle expires at
            <n-tag type="warning" :bordered="false" size="small">
              {{ formatDate(bundle.expiresAt, "DD-MM-YYYY HH:mm") }}
            </n-tag>
            <div>
              (in
              <n-countdown :duration="getDifferenceToNow(bundle.expiresAt)" />
              hours)

              <n-progress
                type="line"
                status="warning"
                :percentage="percentage"
                :show-indicator="false"
              />
            </div>
          </template>
        </n-thing>

        <n-divider />
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed, watch } from "vue";
import {
  UserAvatar as UserAvatarIcon,
  Information as InfoIcon,
} from "@vicons/carbon";
import {
  NDrawer,
  NDrawerContent,
  NDivider,
  NThing,
  NIcon,
  NTag,
  NAvatar,
  NProgress,
  NCountdown,
} from "naive-ui";

import { Drawer } from "@/types/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useBundlesStore } from "@/store/bundles";
import formatDate from "@/helpers/dayjs/formatDate";
import { BundleExpire } from "@shared/types/enums/BundleExpire";
import getDifferenceToNow from "@/helpers/dayjs/getDifferenceToNow";

let percentage = 0;

const drawerStore = useDrawerStore();
const bundlesStore = useBundlesStore();

const isActive = computed((): boolean => {
  return drawerStore.isDrawerActive(Drawer.Bundle) || false;
});

const bundle = computed(() => bundlesStore.activeBundle);

const onShowUpdate = () => {
  drawerStore.setActiveDrawer(null);
};

watch(isActive, async () => {
  if (!isActive.value || !bundle.value) {
    return;
  }

  const { expiresAt } = bundle.value;

  const now = dayjs();
  const parsedExpiresAt = dayjs(expiresAt);

  percentage = Math.ceil(100 - now.valueOf() / parsedExpiresAt.valueOf());
});
</script>
