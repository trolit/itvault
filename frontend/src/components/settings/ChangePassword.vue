<template>
  <div>
    <n-h2>Change Password</n-h2>

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
  </div>
</template>

<script setup lang="ts">
import { NForm, NFormItem, NInput, NH2 } from "naive-ui";
</script>
