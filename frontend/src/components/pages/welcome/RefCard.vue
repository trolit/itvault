<template>
  <n-card size="medium" class="ref-card">
    <n-thing>
      <template #avatar>
        <n-avatar>
          <n-icon>
            <component :is="icon" />
          </n-icon>
        </n-avatar>
      </template>

      <template #header>
        <span class="title">
          {{ title }}
        </span>
      </template>

      <slot name="description">
        <div class="description">
          {{ description }}
        </div>
      </slot>

      <slot name="actions">
        <div class="actions">
          <router-link :to="to">
            <n-button type="info" dashed>
              Open
              <n-icon :size="15">
                <arrow-up-right-icon />
              </n-icon>
            </n-button>
          </router-link>
        </div>
      </slot>
    </n-thing>
  </n-card>
</template>

<script setup lang="ts">
import { ArrowUpRight as ArrowUpRightIcon } from "@vicons/carbon";
import { NIcon, NCard, NAvatar, NThing, NButton } from "naive-ui";

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
