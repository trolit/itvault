<template>
  <div>
    <n-h2>Your profile</n-h2>

    <n-form class="profile-form" label-placement="left">
      <n-form-item required label="First name">
        <n-input placeholder="type your first name..." />
      </n-form-item>

      <n-form-item required label="Last name">
        <n-input placeholder="type your last name..." />
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { NForm, NFormItem, NInput, NH2 } from "naive-ui";
</script>
