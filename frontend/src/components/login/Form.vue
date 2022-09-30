<template>
  <n-form :show-label="false">
    <n-form-item path="inputValue">
      <n-input type="text" size="large" placeholder="Login" />
    </n-form-item>

    <n-form-item path="inputValue">
      <n-input
        size="large"
        :maxlength="8"
        type="password"
        placeholder="Password"
        show-password-on="mousedown"
      />
    </n-form-item>

    <div class="actions">
      <n-button text :bordered="false" type="tertiary"> Sign in </n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { NInput, NForm, NFormItem, NButton } from "naive-ui";
</script>
