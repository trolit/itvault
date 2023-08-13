<template>
  <div class="file-page">
    <n-card :segmented="{ content: true }">
      <template #header>
        <card-header />
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
import { NCard } from "naive-ui";

import CardHeader from "./CardHeader.vue";
</script>
