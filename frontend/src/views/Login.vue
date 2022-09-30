<template>
  <div class="login-page page">
    <n-card>
      <div class="brand-wrapper">
        <brand>
          <template #extra-text>
            Your tool <icon :value="DotMarkIcon" /> Your data
            <icon :value="DotMarkIcon" /> Our experience
          </template>
        </brand>
      </div>

      <n-divider />

      <div class="form-wrapper">
        <login-form />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NDivider } from "naive-ui";
import { DotMark as DotMarkIcon } from "@vicons/carbon";

import Icon from "@/components/common/Icon.vue";
import Brand from "@/components/common/Brand.vue";
import LoginForm from "@/components/login/Form.vue";
</script>
