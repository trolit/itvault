<template>
  <div class="brand">
    <div class="primary-content">
      <icon :value="BrandIcon" />

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
</script>
