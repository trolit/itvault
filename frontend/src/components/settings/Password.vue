<template>
  <n-form class="password-form" label-placement="left">
    <n-form-item required label="Old password">
      <n-input />
    </n-form-item>

    <n-form-item required label="New password">
      <n-input />
    </n-form-item>

    <n-form-item required label="Confirm new password">
      <n-input />
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { NForm, NFormItem, NInput } from "naive-ui";
</script>
