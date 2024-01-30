<template>
  <n-card class="new-member-card">
    <n-icon :component="AddIcon" :depth="3" :size="80" />

    <n-text :depth="3">Add member to workspace</n-text>

    <!-- @TODO - use AsynchronousSelect -->
    <n-input
      :style="{ marginTop: '20px' }"
      disabled
      type="text"
      placeholder="Start typing to find user.."
    />
  </n-card>
</template>

<script setup lang="ts">
import { AddAlt as AddIcon } from "@vicons/carbon";
import { NCard, NInput, NIcon, NText } from "naive-ui";

interface IProps {}

defineProps<IProps>();
</script>
