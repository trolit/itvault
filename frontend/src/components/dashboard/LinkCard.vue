<template>
  <n-card>
    <n-space vertical justify="center" align="center">
      <n-icon :component="icon" :size="80" />

      <router-link :to="to">
        <n-button size="large">{{ title }}</n-button>
      </router-link>

      <n-text depth="3">
        <small>
          <em> {{ description }} </em>
        </small>
      </n-text>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NSpace, NIcon, NButton, NText } from "naive-ui";

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
