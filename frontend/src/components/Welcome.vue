<template>
  <div class="welcome">
    <div class="content">
      <div class="icon">
        <n-icon>
          <face-activated-icon />
        </n-icon>
      </div>

      <div class="title">Welcome back,</div>

      <div class="description">
        If it's first launch, check Introduction section
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NIcon } from "naive-ui";
import { FaceActivated as FaceActivatedIcon } from "@vicons/carbon";
</script>
