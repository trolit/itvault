<template>
  <div class="file-page">
    <n-card>
      <template #header>
        <div style="overflow: auto">
          <n-timeline horizontal>
            <n-timeline-item>
              <template #default>
                <n-button>v1</n-button>

                <div>
                  <small>2023-02-12</small>
                </div>
              </template>
            </n-timeline-item>

            <n-timeline-item>
              <template #default>
                <n-button type="info" dashed>
                  <n-icon :component="AddIcon" :size="25" />
                </n-button>
              </template>
            </n-timeline-item>
          </n-timeline>

          <n-button>Notes</n-button>

          <n-divider />
        </div>
      </template>

      <!-- @TODO scroll -->
      <template #default> CONTENT @TBA </template>
    </n-card>

    <!-- @TODO variant header section -->

    <!-- @TODO notes drawer -->

    <!-- @TODO variant content READ + MANAGE -->
  </div>
</template>

<script setup lang="ts">
import { Add as AddIcon } from "@vicons/carbon";
import {
  NCard,
  NButton,
  NTimeline,
  NTimelineItem,
  NDivider,
  NIcon,
} from "naive-ui";
</script>
