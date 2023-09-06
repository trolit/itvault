<template>
  <ref-card :icon="UserProfileIcon" :title="email">
    <template #content>
      <n-descriptions
        label-placement="top"
        class="text-center"
        label-align="center"
        :label-style="{ fontWeight: 700, paddingBottom: '10px' }"
      >
        <n-descriptions-item label="Owner">
          {{ fullName }}
        </n-descriptions-item>

        <n-descriptions-item label="Workspaces"> 10 </n-descriptions-item>
        <n-descriptions-item label="Account type">
          <n-tag type="info"> {{ roleName }} </n-tag>
        </n-descriptions-item>
      </n-descriptions>

      <n-divider />

      <div class="scrollable-data">
        <div class="access">
          <div class="title">Your permissions</div>

          <n-scrollbar trigger="none">
            <div class="levels">
              <div
                v-for="(key, index) in Object.keys(groupedPermissions)"
                :key="index"
                :style="{ marginRight: '12px' }"
              >
                {{ key }}

                <n-tag
                  v-for="(
                    { name, enabled }, permissionIndex
                  ) in groupedPermissions[key]"
                  :type="enabled ? 'success' : 'error'"
                  :key="`group-${index}-permission-${permissionIndex}`"
                >
                  <template #icon>
                    <n-icon
                      :component="
                        enabled ? OwnedPermissionIcon : NotOwnedPermissionIcon
                      "
                    />
                  </template>

                  {{ name }}
                </n-tag>
              </div>
            </div>
          </n-scrollbar>
        </div>

        <div class="timeline">
          <div class="title">Latest sessions</div>

          <n-scrollbar trigger="none">
            <n-timeline>
              <n-timeline-item
                title="Success"
                content="success content"
                time="2018-04-03 20:46"
              />

              <n-timeline-item
                type="warning"
                title="Warning"
                content="warning content"
                time="2018-04-03 20:46"
              />

              <n-timeline-item
                title="Info"
                content="info content"
                time="2018-04-03 20:46"
                line-type="dashed"
              />

              <n-timeline-item
                title="Info"
                content="info content"
                time="2018-04-03 20:46"
                line-type="dashed"
              />

              <n-timeline-item
                title="Info"
                content="info content"
                time="2018-04-03 20:46"
                line-type="dashed"
              />

              <n-timeline-item
                title="Info"
                content="info content"
                time="2018-04-03 20:46"
                line-type="dashed"
              />
            </n-timeline>
          </n-scrollbar>
        </div>
      </div>
    </template>
  </ref-card>
</template>

<script setup lang="ts">
import {
  NTag,
  NIcon,
  NDivider,
  NTimeline,
  NScrollbar,
  NStatistic,
  NDescriptions,
  NTimelineItem,
  NDescriptionsItem,
} from "naive-ui";
import { computed } from "vue";
import groupBy from "lodash/groupBy";
import {
  UserProfile as UserProfileIcon,
  Close as NotOwnedPermissionIcon,
  Checkmark as OwnedPermissionIcon,
} from "@vicons/carbon";

import RefCard from "./RefCard.vue";
import { useAuthStore } from "@/store/auth";

const {
  profile: { email, roleName, permissions, fullName },
} = useAuthStore();

const groupedPermissions = computed(() => {
  return groupBy(permissions, value => value.group);
});
</script>
