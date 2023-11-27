<template>
  <div class="brand">
    <div class="primary-content">
      <icon v-if="!noIcon" :value="BrandIcon" />

      <span>itvault</span>
    </div>

    <div class="extra-text">
      <slot name="extra-text" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Development as BrandIcon } from "@vicons/carbon";

import Icon from "./Icon.vue";

interface IProps {
  noIcon?: boolean;
}

withDefaults(defineProps<IProps>(), {
  noIcon: false,
});
</script>
