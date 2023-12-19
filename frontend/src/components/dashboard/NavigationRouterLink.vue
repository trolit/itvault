<template>
  <router-link :to="to" class="extra-button">
    <n-button size="large">
      <n-icon :component="icon" :size="50" />

      <div class="xd">
        <span class="title">
          {{ title }}
        </span>

        <small>
          <n-text :depth="3">
            {{ description }}
          </n-text>
        </small>
      </div>
    </n-button>
  </router-link>
</template>

<script setup lang="ts">
import { NIcon, NButton, NText } from "naive-ui";

defineProps({
  icon: {
    type: Object,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: false,
    default: "",
  },

  to: {
    type: String,
    required: false,
    default: "",
  },
});
</script>
