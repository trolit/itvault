<template>
  <ref-card :icon="UserProfileIcon" title="account.email@company.com">
    <template #content>
      <div class="statistics">
        <n-statistic label="Workspaces"> 10 </n-statistic>

        <n-statistic label="Account type">
          <!-- @TODO Itvault admin, Company admin, Company user-->
          <n-tag type="info"> Company user </n-tag>
        </n-statistic>
      </div>

      <n-divider />

      <div class="scrollable-data">
        <!-- @TODO hide for account type that has R/W access to all workspaces -->
        <div class="access">
          <div class="title">Privileges</div>

          <n-scrollbar trigger="none">
            <div class="levels">
              <n-tag type="success"> vue (2) </n-tag>

              <n-tag type="success"> .NET (0) </n-tag>
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
  NDivider,
  NTimeline,
  NScrollbar,
  NStatistic,
  NTimelineItem,
} from "naive-ui";
import { UserProfile as UserProfileIcon } from "@vicons/carbon";

import RefCard from "./RefCard.vue";
</script>
