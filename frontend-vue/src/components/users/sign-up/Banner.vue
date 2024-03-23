<template>
  <div class="banner">
    <div class="element">
      <n-icon :component="BrandIcon" :size="120" />

      <n-h1>Welcome {{ email }},</n-h1>
    </div>

    <div class="element main-description">
      <n-text :depth="2">
        You were invited to our source code vault by one of the members!
        Regardless of the role that was assigned to you, please complete
        registration process by setting your own password. We recommend to
        generate strong password using one of available tools (i.e.
        <n-button
          text
          tag="a"
          href="https://www.lastpass.com/features/password-generator"
          target="_blank"
          type="primary"
        >
          LastPass Password Generator </n-button
        >).
      </n-text>
    </div>

    <div class="element">
      <n-text :depth="3">
        <small>
          If you require further assistance or have any questions, please
          contact our administration team (administration@itvault.com) or person
          that informed you about creating an account for you.
        </small>
      </n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NH1, NText, NIcon, NButton } from "naive-ui";
import { Development as BrandIcon } from "@vicons/carbon";

interface IProps {
  email: string;
}

defineProps<IProps>();
</script>
