<template>
  <n-card size="medium" class="content-card">
    <n-thing>
      <template #avatar>
        <n-avatar>
          <n-icon :component="icon" />
        </n-avatar>
      </template>

      <template #header>
        <span class="title">
          {{ title }}
        </span>
      </template>

      <template #header-extra>
        <slot name="header-extra" />
      </template>

      <div class="content">
        <slot name="content">
          <div class="description">
            <em>{{ description }}</em>
          </div>

          <div class="actions">
            <router-link :to="to">
              <n-button>
                Open

                <n-icon :size="15">
                  <arrow-up-right-icon />
                </n-icon>
              </n-button>
            </router-link>
          </div>
        </slot>
      </div>
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
