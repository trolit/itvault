<template>
  <div class="form-wrapper">
    <n-form>
      <n-form-item label="Your reference ID (READ ONLY)">
        <n-input
          readonly
          :value="id"
          type="password"
          show-password-on="mousedown"
        />
      </n-form-item>

      <n-form-item label="Your code (READ ONLY)">
        <n-input
          readonly
          :value="code"
          type="password"
          show-password-on="mousedown"
        />
      </n-form-item>

      <n-form-item label="Password">
        <n-input
          type="password"
          show-password-on="mousedown"
          placeholder="password"
        />
      </n-form-item>

      <n-form-item label="Confirm password">
        <n-input
          type="password"
          show-password-on="mousedown"
          placeholder="confirm password"
        />
      </n-form-item>
    </n-form>

    <div class="warning">
      <n-text :depth="3">
        <small>
          Before submitting form, please make sure that you are using the link
          that was provided at email address! If some data (except password)
          won't match the ones that were generated for your account, it will be
          blocked!!
        </small>
      </n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NText, NForm, NFormItem, NInput } from "naive-ui";

interface IProps {
  id: string;

  email: string;

  code: string;
}

defineProps<IProps>();
</script>
