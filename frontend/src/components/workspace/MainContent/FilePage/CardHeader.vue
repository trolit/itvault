<template>
  <!-- @TODO overflow: auto for timeline! -->
  <div class="card-header">
    <div class="timeline-wrapper" style="overflow: auto">
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
    </div>

    <div class="actions">
      <n-button>Notes</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Add as AddIcon } from "@vicons/carbon";
import { NButton, NTimeline, NTimelineItem, NIcon } from "naive-ui";
</script>
